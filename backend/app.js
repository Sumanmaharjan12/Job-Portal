// app 
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const profileRoutes = require('./routes/profile-routes');

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