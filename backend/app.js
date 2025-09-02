// app 
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();


// import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const profileRoutes = require('./routes/profile-routes');
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require('./routes/application.routes');
const adminDashboardRoutes = require('./routes/admindashboard');
const adminUserRoutes = require('./routes/adminUser.routes');
const adminJobRoutes = require('./routes/adminJobRoutes');
const recommendationRoutes = require('./routes/recommendation');
const jobCategoryRoutes = require('./routes/jobCategoryRoutes');
const adminApplicationRoutes = require('./routes/adminApplicationRoutes');
// middleware
const authMiddleware = require('./middleware/auth.middleware');

// enable cross-origin resource sharing 
app.use(cors());

// parse json request
app.use(express.json());

// serve static files from /public folder
app.use(express.static(path.join(__dirname,'public')));

// mount auth routes on api
app.use('/api/auth',authRoutes);

// mount user routes on api
app.use('/api/user',userRoutes)

// for profile
app.use('/api/profile', profileRoutes);

// for job
app.use('/api/jobs',authMiddleware,jobRoutes);

// job application
app.use('/api/applications',authMiddleware,applicationRoutes);

// admin dashboard
app.use('/api/admin',adminDashboardRoutes);

// admin user profile
app.use('/api/admin',adminUserRoutes);

// admin user job
app.use("/api/admin",adminJobRoutes);

// for recommending job
app.use("/api/recommendations",recommendationRoutes);

// for jobCategory
app.use("/api/jobcategory",jobCategoryRoutes);

// for admin application
app.use("/api/adminapplication",adminApplicationRoutes);
// Serve static uploaded files
app.use('/uploads', express.static('uploads'));

// debugger
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  next();
});

// handle erros
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// global error
app.use((err, req, res, next)=>{
    res.status(500).json({message:'Internal server error'});
});
module.exports=app;