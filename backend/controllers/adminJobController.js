const Job = require("../models/job")

const getAllJobs = async (req , res) => {
    try{
        const jobs = await Job.find().populate("postedBy", "companyName email").sort({ createdAt: -1});

        res.json(jobs);
    }catch(err){
        res.status(500).json({message: "Error fetching jobs", error: err.message});
    }
};

const updateJobStatus = async (req, res) =>{
    try{
        const {status} = req.body;

        if(!["pending", "posted" , "rejected"].includes(status)){
            return res.status(400).json({message:"Invalid Status"});
        }
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            {status},
            {new: true}
        );
        if(!updatedJob){
            return res.status(404).json({message: "Job not found"});
        }
        res.json({message: "status updated successfully", job:updatedJob});
    }catch(err){
        res.status(500).json({message: "Error updating status", error:err.message});
    }
};
module.exports = {getAllJobs, updateJobStatus};