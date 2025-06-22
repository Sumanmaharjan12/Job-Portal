const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const UserProfile = require('../models/user-profile'); // Case-sensitive filename
const authMiddleware = require('../middleware/auth.middleware'); // Must attach user ID to req.user
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

// Upload handler for image and cv
router.post(
  '/',
  authMiddleware,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'cv', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
   const userId = new mongoose.Types.ObjectId(req.user.id); // from auth middleware

      const {
        phone, location, gender, dob,
        qualification, experience, skills
      } = req.body;

      
      const skillsArr = typeof skills === 'string' ? JSON.parse(skills) : skills;
      let profile = await UserProfile.findOne({ userId });
      
      if (!profile) {
          profile = new UserProfile({ userId });
        }
        
      // Update fields
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

module.exports = router;
