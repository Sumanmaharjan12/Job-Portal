const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  role: { type: String, enum: ['JobSeeker', 'JobKeeper'], required: true },
  phone: String,
  location: String,
  gender: String,
  dob: Date,
  qualification: String,
  experience: String,
  skills: [String],
  cvUrl: String, // store file path or url
  imageUrl: String, // store profile image path or url
  companyName: String,
  companyAddress: String,
  companyWebsite: String,
  establishedDate: Date,
  jobOpenings: Number,
  
  // validator
  riskLevel: { type: String, default: 'Safe' },
  issues: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', UserProfileSchema);