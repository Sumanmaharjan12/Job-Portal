const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  phone: String,
  location: String,
  gender: String,
  dob: Date,
  qualification: String,
  experience: Number,
  skills: [String],
  cvUrl: String, // store file path or url
  imageUrl: String // store profile image path or url
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', UserProfileSchema);