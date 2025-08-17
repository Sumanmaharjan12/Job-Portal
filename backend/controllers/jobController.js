const mongoose = require("mongoose");
const Job = require("../models/job");
const User = require("../models/user-profile");
const Application = require('../models/application');
const Category = require("../models/jobcategory");

const postJob = async(req, res)=> {
    try{
        const userID = req.user._id;

        // get company profile including jobOpening
        const company = await User.findById(userID).select("jobOpenings");
        if(!company){
          return res.status(404).json({error: "company profile not found"});
        }
        // count current active jobs
        const currentJobCount = await Job.countDocuments({
          postedBy: userID,
          status:{$in:["pending", "posted"]},
        });
        // check job limits exceeded
        if(currentJobCount >=(company.jobOpenings|| 0)){
          return res.status(403).json({
            error: `Job posting limit reached. You can post up to ${company.jobOpenings} jobs. Please contact admin.`,

          })
        }
        const jobData={
            ...req.body,
            postedBy: userID,
            status: "pending",
        };
        if (typeof jobData.skills === 'string') {
            jobData.skills = jobData.skills
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0);
        }
        const newJob = new Job(jobData);
        await newJob.save();
       const populatedJob =  await newJob.populate([
      { path: "postedBy", select: "_id companyName imageUrl" },
      { path: "category", select: "name" },
    ]);
        return res.status(201).json({message: "Job posted successfully",job: populatedJob});
    }catch(error){
        console.error("Error in postJob:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Failed to post Job", details: error.message || error });
    }
  }
};
const getJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobs = await Job.find({
      postedBy:userId,
      status: { $in: ['posted', 'pending']
    }}).populate('postedBy', '_id companyName imageUrl jobOpenings') 
    .populate("category", "name")// populate these fields from the user profile
      .exec();
      
      // calculate remaining JobOpenings
      const companyIds=[
        ...new Set(jobs.map((job)=>job.postedBy._id.toString())),
      ];

      // count active jobs
      const activeCounts = await Job.aggregate([
        {
          $match:{
           postedBy: { $in: companyIds.map((id) => new mongoose.Types.ObjectId(id)) },
            status:{$in:["posted","pending"]},
          },
        },
        {
          $group:{
            _id:"$postedBy",
            count:{$sum:1},
          },
        },
      ]);
      
    // Convert aggregation result to a lookup object
    const activeCountsMap = {};
    activeCounts.forEach((item) => {
      activeCountsMap[item._id.toString()] = item.count;
    });

    // Step 4: Attach remainingJobOpenings to postedBy for each job
  const jobsWithRemaining = jobs.map((job) => {
  const company = job.postedBy.toObject();
  const activeCount = activeCountsMap[company._id.toString()] || 0;
  const remaining = (company.jobOpenings || 0) - activeCount;
  company.remainingJobOpenings = remaining >= 0 ? remaining : 0;

  return {
    ...job.toObject(),
    postedBy: company,
  };
});

    res.json(jobsWithRemaining);

  } catch (error) {
      console.error("Error in getJob:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// getalljob
const getalljobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      status: { $in: ['posted'] }
    }).populate('postedBy', '_id companyName imageUrl')
    .populate('category' , 'name');

    res.json(jobs);
  } catch (error) {
    console.error('Error in getAllJobs:', error);
    res.status(500).json({ error: 'Failed to get jobs' });
  }
};
// update the job
const updateJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId, ...updateData } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job Id is required" });
    }

    const job = await Job.findOne({ jobId, postedBy: userId });
    if (!job) {
      return res.status(404).json({ message: "Job not found or not authorized" });
    }

    const allowedUpdates = [
      "title",
      "description",
      "category",
      "type",
      "salary",
      "experience",
      "education",
      "skills",
      "language",
      "softSkills",
      "status"
    ];

    allowedUpdates.forEach(field => {
      if (field in updateData) {
        if (field === "category") job.category = updateData.category;
      }
    });

    if (typeof job.skills === 'string') {
      job.skills = job.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }

    await job.save();

    res.json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error("Error in updateJob:", error);
    res.status(500).json({ error: "Failed to update job" });
  }
};



// delete the job
const deleteJob = async(req,res) => {
  try{
    const userId = req.user._id;
    const {jobId} = req.body;

    if(!jobId){
      return res.status(400).json({message: 'Job Id is required'});
    }
    const job = await Job.findOne({jobId: jobId, postedBy: userId});
    if(!job){
      return res.status(404).json({message:'Job not found'});
    }
     await Application.deleteMany({ job: job._id });
    await Job.deleteOne({_id: job._id});
    return res.json({message: `Job Deleted successfully.`});
  }catch(err){
    console.error('Error Deleting job:', err);
    res.status(500).json({message:'Internal server error'});
  }
};

// get categories
const getCategories = async(req,res) =>{
  try{
    const categories = await Job.aggregate([
      {
        $group:{
          _id: "$category",
          count:{$sum:1}
        }
      }
    ]);
    
    res.status(200).json(categories);
  }catch(err){
    console.error("error in getJobCategories",err);
    res.status(500).json({error:"Server error"})
  }
};

module.exports = {postJob,getJob,deleteJob,updateJob,getalljobs,getCategories};