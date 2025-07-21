const mongoose = require("mongoose");
const crypto = require("crypto");

const JobSchema = new mongoose.Schema(
    {
        jobId:{
            type: String,
            unique: true,
        },
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

JobSchema.pre("save", async function () {
  if (this.isNew && !this.jobId) {
    let newJobId;
    let isUnique = false;

    while (!isUnique) {
      newJobId = crypto.randomBytes(3).toString("hex").toUpperCase();
      const existing = await mongoose.models.Job.findOne({ jobId: newJobId });
      if (!existing) {
        isUnique = true;
      }
    }

    this.jobId = newJobId;
  }
});


module.exports = mongoose.model("Job", JobSchema);