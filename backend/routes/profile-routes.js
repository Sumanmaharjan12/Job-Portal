const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/user.model')
const UserProfile = require('../models/user-profile');
const authMiddleware = require('../middleware/auth.middleware');
const { default: mongoose } = require('mongoose');
const { validateBusiness } = require('../businessValidator');

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


// Create/Update Profile
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
      const {
        role, phone, location, gender, dob,
        qualification, experience, skills,
        companyName, companyAddress, companyWebsite,
        establishedDate, jobOpenings
      } = req.body;

      if (!role || !['JobSeeker', 'JobKeeper'].includes(role)) {
        return res.status(400).json({ message: 'Invalid or missing role' });
      }

      const skillsArr = typeof skills === 'string' ? JSON.parse(skills) : skills;

      let profile = await UserProfile.findOne({ userId });

      if (!profile) {
        profile = new UserProfile({ _id: userId, userId, role });
      }

      // Common fields
      profile.role = role;
      profile.phone = phone || '';
      profile.location = location || '';
      profile.gender = gender || '';
      profile.dob = dob ? new Date(dob) : null;

      if (req.files['image']) {
        profile.imageUrl = req.files['image'][0].path;
      }

      // Seeker-specific
      if (role === 'JobSeeker') {
        profile.qualification = qualification || '';
       profile.experience = experience || '';
        profile.skills = skillsArr || [];

        if (req.files['cv']) {
          profile.cvUrl = req.files['cv'][0].path;
        }

        profile.riskLevel= undefined;
        profile.issues=undefined;
      }

      // Hirer-specific
      if (role === 'JobKeeper') {
        profile.companyName = companyName || '';
        profile.companyAddress = companyAddress || '';
        profile.companyWebsite = companyWebsite || '';
        profile.establishedDate = establishedDate ? new Date(establishedDate) : null;
        profile.jobOpenings = jobOpenings ? Number(jobOpenings) : null;
        profile.location = undefined;
        profile.gender = undefined;
        profile.dob = undefined;
      }
      // validation code
      const {riskLevel, issues} = validateBusiness({
        role: profile.role,
        companyName: profile.companyName,
        companyAddress: profile.companyAddress,
        companyWebsite : profile.companyWebsite,
        establishedDate : profile.establishedDate,
        jobOpenings : profile.jobOpenings,
      });

      if(riskLevel === 'Likely Fake'){
        return res.status(400).json({
          message : 'Fake business detected',
          riskLevel,
          issues,
        });
        
      }

      if (profile.role === 'JobSeeker') {
        delete profile.riskLevel;
        delete issues;
      } else {
        profile.riskLevel = riskLevel;
        profile.issues = issues;
      }
      await profile.save();
     

      res.status(200).json({ message: 'Profile saved successfully', profile });
    } catch (error) {
      console.error('[Profile Save Error]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Check if profile exists
router.get('/check', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await UserProfile.findById(userId);

    if (profile) {
      return res.status(200).json({ exists: true, imageUrl: profile.imageUrl });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('[Profile Check Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Check for existing phone
router.get('/check-phone', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const phoneToCheck = req.query.phone;

    if (!phoneToCheck) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const existingProfile = await UserProfile.findOne({
      phone: phoneToCheck,
      _id: { $ne: userId }
    });

    return res.status(200).json({ exists: !!existingProfile });
  } catch (error) {
    console.error('[Phone Check Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// update profile
router.put('/update',authMiddleware, upload.fields([
  {name: 'image', maxCount: 1},
  {name: 'cv', maxCount:1}
]),
async(req, res) =>{
  try{
    const userId = req.user._id;
    const{
      role,
      phone,
      location,
      gender,
      dob,
      qualification,
      experience,
      skills,
      companyName,
      companyAddress,
      companyWebsite,
      establishedDate,
      jobOpenings,
      name,
      email
    } = req.body;

    if(!role || !['JobSeeker', 'JobKeeper'].includes(role)){
      return res.status(400).json({message: 'Invalid or missing role'});
    }
    let skillsArr = [];
      if (skills) {
        if (typeof skills === 'string') {
          try {
            skillsArr = JSON.parse(skills);
          } catch (err) {
            console.warn('[WARN] skills is not valid JSON, fallback to split by comma');
            skillsArr = skills.split(',').map(s => s.trim());
          }
        } else if (Array.isArray(skills)) {
          skillsArr = skills;
        }
      }
    let profile = await UserProfile.findOne({userId});

    if(!profile){
      return res.status(404).json({message: 'Profile not found'});
    }
    profile.phone = phone || '';
    profile.location = location || '';
    profile.gender = gender || '';
    profile.dob = dob?new Date(dob):null;

    if(req.files && req.files['image']){
      profile.imageUrl = req.files['image'][0].path;
    }

    // update jobseeker
    if(role === 'JobSeeker'){
      profile.qualification = qualification || '';
      profile.experience = experience || '';
      profile.skills = skillsArr || [];
      if(req.files && req.files['cv']){
        profile.cvUrl = req.files['cv'][0].path
      }
     profile.riskLevel= undefined;
        profile.issues=undefined;
    }
    // JobKeeper
    if(role ==='JobKeeper'){
      profile.companyName = companyName || '';
      profile.companyAddress = companyAddress || '';
      profile.companyWebsite = companyWebsite || '';
      profile.establishedDate = establishedDate ? new Date(establishedDate):null;
      profile.jobOpenings = jobOpenings ? Number(jobOpenings):null;
       profile.location = undefined;
        profile.gender = undefined;
        profile.dob = undefined;
    }
    // validate business fields
    const {riskLevel, issues} = validateBusiness({
      role:profile.role,
      companyName : profile.companyName,
      companyAddress : profile.companyAddress,
      companyWebsite : profile.companyWebsite,
      establishedDate: profile.establishedDate,
      jobOpenings: profile.jobOpenings,
    });
    if(riskLevel === 'Likely Fake'){
      return res.status(400).json({
        message: 'Fake Business detected',
        riskLevel,
        issues,
      });
    }
     if (profile.role === 'JobSeeker') {
        delete riskLevel;
        delete issues;
      } else {
        profile.riskLevel = riskLevel;
        profile.issues = issues;
      }
        
        const userUpdate= {};
        if(name) userUpdate.name=name;
        if(email) userUpdate.email=email;

        if(Object.keys(userUpdate).length>0){
          await User.findByIdAndUpdate(userId,userUpdate);
        }
    
    await profile.save();
    const updatedUser = await User.findById(userId).select('name email');
    
    res.status(200).json({message: 'Profile updated successfully',profile});
   }catch(error){
    console.error('Profile update Error', error);
    res.status(500).json({message: 'Internal server error'});
   }
  }
);

// Get full profile
router.get('/details', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await UserProfile.findById(userId);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    const user = await User.findById(userId).select('name email');

    const common = {
      role: profile.role,
      phone: profile.phone,
      location: profile.location,
      gender: profile.gender,
      dob: profile.dob,
      imageUrl: profile.imageUrl,
       name: user ? user.name : '',
    email: user ? user.email : ''
    };

    const seekerData = profile.role === 'JobSeeker'
      ? {
          qualification: profile.qualification,
          experience: profile.experience,
          skills: profile.skills,
          cvUrl: profile.cvUrl
        }
      : {};

    const keeperData = profile.role === 'JobKeeper'
      ? {
          companyName: profile.companyName,
          companyAddress: profile.companyAddress,
          companyWebsite: profile.companyWebsite,
          establishedDate: profile.establishedDate,
          jobOpenings: profile.jobOpenings,
          issues: profile.issues, 
          riskLevel: profile.riskLevel 
        }
      : {};

    res.status(200).json({ ...common, ...seekerData, ...keeperData });
  } catch (error) {
    console.error('[Profile Details Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
