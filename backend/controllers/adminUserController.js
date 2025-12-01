const User = require('../models/user.model');
const UserProfile = require('../models/user-profile');
const Job = require('../models/job'); // Job model
const Application = require('../models/application'); 

const mongoose = require('mongoose');

// Get all JobSeekers
const getAllJobSeekers = async (req, res) => {
  try {
    const jobSeekers = await UserProfile.find({ role: 'JobSeeker' })
      .populate('userId', 'name email')
      .lean();

    res.status(200).json({ jobSeekers });
  } catch (error) {
    console.error('[Admin Get JobSeekers Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all JobKeepers
const getAllJobKeepers = async (req, res) => {
  try {
    const jobKeepers = await UserProfile.find({ role: 'JobKeeper' })
      .populate('userId', 'name email')
      .lean();

    res.status(200).json({ jobKeepers });
  } catch (error) {
    console.error('[Admin Get JobKeepers Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete user and related data
const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Find user profile
    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Delete related data based on role
    if (userProfile.role === 'JobKeeper') {
      // Delete all jobs posted by this JobKeeper
      await Job.deleteMany({ postedBy: userId });

      // Optionally, delete applications related to these jobs
      await Application.deleteMany({ jobId: { $in: await Job.find({ postedBy: userId }).distinct('_id') } });
    } else if (userProfile.role === 'JobSeeker') {
      // Delete all applications by this JobSeeker
      await Application.deleteMany({ applicantId: userId });
    }


    // Delete user profile
    await UserProfile.findOneAndDelete({ userId });

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User, profile, and related data deleted successfully' });
  } catch (error) {
    console.error('[Admin Delete User Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllJobSeekers,
  getAllJobKeepers,
  deleteUserById,
};
