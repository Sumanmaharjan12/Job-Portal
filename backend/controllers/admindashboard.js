const Application = require('../models/application');
const Job = require('../models/job');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');


const addAdmin= async(req, res) => {
    try{
        if (!req.user || req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Access denied: only SuperAdmin can add admins.' });
    }
        const{name,email,password} =req.body;
         const emailLower = email.toLowerCase(); 

        const existingUser = await User.findOne({email:emailLower});
        if(existingUser){
            return res.status(400).json({message:'Email already exists'});
        }
              const newAdmin= await User.create({
                  name,
                  email:emailLower,
                  password,
                  role:'Admin'
              });
        await newAdmin.save();
      res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
        } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const getAllAdmin = async (req, res) => {
  try {
    const admins = await User.find({ role: 'Admin' }) // or 'Admin' depending on your role casing
      .select('name email role createdAt'); // exclude password, only needed fields
    res.status(200).json(admins);
  } catch (error) {
    console.error('getAllAdmins error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    // Counts
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingJobs = await Job.countDocuments({ status: 'pending' });

    // User role counts for pie chart
    const jobKeepersCount = await User.countDocuments({ role: 'jobkeeper' });
    const jobSeekersCount = await User.countDocuments({ role: 'jobseeker' });
    const adminsCount = await User.countDocuments({ role: 'admin' });

    // Application status counts
    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    // Convert aggregation array to object like { pending: X, accepted: Y, rejected: Z }
    const appStatusCounts = {};
    applicationsByStatus.forEach(item => {
      appStatusCounts[item._id] = item.count;
    });

    // Latest data
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('postedBy', 'companyName imageUrl');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    // Recent logged-in users (assuming you track lastLogin in User model)
     const recentApplicationsRaw = await Application.find()
  .sort({ appliedAt: -1 })  // use appliedAt instead of createdAt
  .limit(5)
  .populate('user', 'name email')               
  .populate({
    path: 'job',
    select: 'title postedBy',
    populate: { path: 'postedBy', select: 'companyName' } 
  });

const recentApplications = recentApplicationsRaw.map(app => ({
  name: app.user?.name || 'N/A',
  email: app.user?.email || 'N/A',
  jobTitle: app.job?.title || app.jobTitle || 'N/A',          // fallback to app.jobTitle if needed
  companyName: app.job?.postedBy?.companyName || app.companyName || 'N/A', // fallback to app.companyName
  appliedOn: app.appliedAt
}));

    res.status(200).json({
      totalUsers,
      totalJobs,
      totalApplications,
      pendingJobs,
      jobKeepersCount,
      jobSeekersCount,
      adminsCount,
      appStatusCounts,
      recentJobs,
      recentUsers,
    recentApplications
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardStats, addAdmin, getAllAdmin };
