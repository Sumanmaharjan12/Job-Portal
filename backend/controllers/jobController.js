const mongoose = require("mongoose");
const Job = require("../models/job");
const User = require("../models/user-profile")

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
        }
        const newJob = new Job(jobData);
        await newJob.save();
       const populatedJob = await newJob.populate('postedBy', '_id companyName imageUrl');
        res.status(201).json({message: "Job posted successfully",job:newJob});
    }catch(error){
        res.status(500).json({error: "Failed to post Job"});
    }
};
const getJob = async (req, res) => {
  try {
    const jobs = await Job.find({status: { $in: ['posted', 'pending'] }})
      .populate('postedBy', '_id companyName imageUrl jobOpenings') // populate these fields from the user profile
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

module.exports = {postJob,getJob};