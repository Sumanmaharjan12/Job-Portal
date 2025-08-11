const mongoose = require('mongoose');
const User = require('../models/user.model');

async function createSuperAdmin(){
    try{
        const exists = await User.findOne({
            role:'SuperAdmin'
        });
        if(exists){
            
            return;
        }
        const newAdmin = new User({
            name:'Super Admin',
            email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@gmail.com',
            password:process.env.SUPER_ADMIN_PASSWORD || 'admin123',
            role: 'SuperAdmin',
        });

        await newAdmin.save();
        
    }catch(err){
        console.error('Error seeding SuperAdmin',err);
    }
}

module.exports= {createSuperAdmin};