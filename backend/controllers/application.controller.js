const Application = require('../models/application');
const Job = require('../models/job');
const User = require('../models/user.model')
const UserProfile = require('../models/user-profile');

const applyJob = async(req,res) =>{
    try{
        const userId =  req.user._id;
        const {jobId} = req.body;

           if (!jobId) return res.status(400).json({ message: 'JobId is required' });
            if (!userId) return res.status(401).json({ message: 'Unauthorized: user info missing' });

    // Fetch user and job info
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Get UserProfile extra info
    const userProfile = await UserProfile.findOne({ userId: userId });
    if (!userProfile) return res.status(404).json({ message: 'User profile not found' });

    const job = await Job.findById(jobId).populate('postedBy');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Prevent duplicate application
    const existingApp = await Application.findOne({ job: jobId, user: userId });
    if (existingApp) {
      return res.status(409).json({ message: 'You have already applied to this job' });
    }

    const application = new Application({
      job: job._id,
      user: userId,
      jobkeeper: job.postedBy._id,
      appliedAt: new Date(),

      name: user.name,
      email: user.email,
      location: userProfile.location,
      phone : userProfile.phone,
      gender : userProfile.gender,
      qualification: userProfile.qualification,
      experience : userProfile.experience,
      skills : userProfile.skills,
      cvUrl: userProfile.cvUrl,
      imageUrl: userProfile.imageUrl,

      jobTitle: job.title,
      companyName: job.postedBy.companyName,

      status: 'pending',
    });

    await application.save();

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('applyToJob error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// to get
const getApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role ? req.user.role.toLowerCase().trim() : '';

    let applications;

    if (userRole === 'jobkeeper') {
      applications = await Application.find({ jobkeeper: userId });
    } else if (userRole === 'jobseeker') {
      applications = await Application.find({ user: userId }).populate({
        path: 'job',
        select: 'title skills postedBy',
        populate: {
          path: 'postedBy',
          select: 'companyName companyAddress imageUrl'
        }
      });
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    const formatted = applications.map(app => {
      if (userRole === 'jobseeker') {
        return {
          _id: app._id,
          name: app.name,
          email: app.email,
          phone: app.phone,
          location: app.location,
          status: app.status,

          jobTitle: app.job?.title || '',
          jobSkills: app.job?.skills || [],
          companyName: app.job?.postedBy?.companyName || '',
          companyAddress: app.job?.postedBy?.companyAddress || '',
          companyProfileImage: app.job?.postedBy?.imageUrl || '',
        };
      } else {
        return app;
      }
    });

    res.status(200).json(formatted);

  } catch (err) {
    console.error('getApplications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// updates
const updateApplications = async(req,res) => {
  try{
    const jobkeeperId = req.user._id;
    const {applicationId} = req.params
    const {status} = req.body;

    if(!['pending', 'accepted','rejected'].includes(status)){
      return res.status(400).json({message:'Invalid status value'});
    }
    const application = await Application.findOne({
      _id: applicationId,
      jobkeeper: jobkeeperId
    });
    if(!application){
      return res.status(404).json({message:'Applcation not found'});
    }
    application.status = status;
    await application.save();
    res.status(200).json({message: 'Application status updated successfully'});
  } catch(error){
      console.error('updateApplicationStatus error:',error);
      res.status(500).json({message: 'Server error'});
    }
  };

  // deleteapplication
  const deleteApplications = async (req, res) => {
    try{
      const userId= req.user._id;
      const {applicationId} = req.params;
       const application = await Application.findOne({ _id: applicationId, user: userId });

    if (!application) {
      return res.status(404).json({ message: 'Application not found or unauthorized' });
    }

    await Application.deleteOne({ _id: applicationId });

    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('deleteApplication error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports ={applyJob,getApplications,updateApplications,deleteApplications};