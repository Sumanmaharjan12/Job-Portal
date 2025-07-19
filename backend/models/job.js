const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
    {
        
        title: { type: String, required:true},
        description: String,
        category: String,
        type: String,
        salary: Number,

        experience: { type: String, required:true},
        education: { type: String, required: true},
        skills: {type: [String], required: true},
        language: String,
        softSkills: String,

        postedBy: {type: mongoose.Schema.Types.ObjectId, ref:"UserProfile", required:true},

        // status
        status:{
            type:String,
            enum:['pending','posted','rejected'],
            default:'pending',
        },
    },
    {timestamps:true}
);

module.exports = mongoose.model("Job", JobSchema);