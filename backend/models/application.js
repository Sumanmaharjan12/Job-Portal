const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    job: {type: mongoose.Schema.Types.ObjectId, ref:'Job', required:true},
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    jobkeeper: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

    appliedAt: {type: Date, default: Date.now},

    status:{
        type:String,
        enum:['pending','accepted','rejected'],
        default: 'pending'
    },

  name: String,
  email: String,
  location: String,

  phone: String,
  gender: String,
  dob: Date,
  qualification: String,
  experience: String,
  skills: [String],

  cvUrl: String,
  imageUrl: String,

  jobTitle: String,
  companyName: String,
});


module.exports = mongoose.model('Application',ApplicationSchema);