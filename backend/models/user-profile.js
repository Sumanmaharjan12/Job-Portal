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
  experience: Number,
  skills: [String],
  cvUrl: String, // store file path or url
  imageUrl: String, // store profile image path or url
  companyName: String,
  companyAddress: String,
  companyWebsite: String,
  establishedDate: Date,
  jobOpenings: Number
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', UserProfileSchema);