const User = require('../models/user.model');
const UserProfile = require('../models/user-profile');
const mongoose = require('mongoose');

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

const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const deletedProfile = await UserProfile.findOneAndDelete({ userId });
    if (!deletedProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User and profile deleted successfully' });
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
