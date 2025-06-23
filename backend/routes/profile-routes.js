const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const UserProfile = require('../models/user-profile');
const authMiddleware = require('../middleware/auth.middleware');
const { default: mongoose } = require('mongoose');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Upload handler for image and CV
router.post(
  '/',
  authMiddleware,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'cv', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const userId = req.user._id;
      console.log('userId:', userId); // from auth middleware

      const {
        phone, location, gender, dob,
        qualification, experience, skills
      } = req.body;

      const skillsArr = typeof skills === 'string' ? JSON.parse(skills) : skills;

      // Check if profile already exists (shouldn't if _id = userId)
      let profile = await UserProfile.findOne({ userId: userId });

      if (!profile) {
         profile = new UserProfile({ _id: userId, userId: userId });
      }


      // Update profile fields
        profile.userId = userId;
      profile.phone = phone;
      profile.location = location;
      profile.gender = gender;
      profile.dob = dob ? new Date(dob) : null;
      profile.qualification = qualification;
      profile.experience = experience ? Number(experience) : null;
      profile.skills = skillsArr;

      if (req.files['image']) {
        profile.imageUrl = req.files['image'][0].path;
      }

      if (req.files['cv']) {
        profile.cvUrl = req.files['cv'][0].path;
      }

      await profile.save();

      res.status(200).json({ message: 'Profile saved successfully', profile });

    } catch (error) {
      console.error('[Profile Save Error]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);
router.get('/check', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Use _id since you're setting _id as userId in profile
    const profile = await UserProfile.findById(userId);

    if (profile) {
      return res.status(200).json({ exists: true,  imageUrl: profile.imageUrl });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('[Profile Check Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
