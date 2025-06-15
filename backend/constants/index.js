require('dotenv').config();

module.exports={
    ROLES:{
        JOB_SEEKER: 'JobSeeker',
        JOB_HIRER:'JobHirer',
        ADMIN: 'Admin'
    },
    MESSAGES:{
        USER_NOT_FOUND:'User not found',
        INVALID_CREDENTIALS: 'Invalid email or password',
        UNAUTHORIZED: 'Access denied. No token provided',
        FORBIDDEN: 'You do not have permission to access this resources'
    },
    TOKENS:{
        JWT_SECRET: process.env.JWT_SECRET || 'your_default_secret',
        EXPIRES_IN: '7d'
    },
    PORT:5000,
}