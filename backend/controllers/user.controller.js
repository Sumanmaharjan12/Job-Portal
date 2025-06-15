// User.controller

const User = require('../models/user.model');
const {MESSAGES} = require('../constants');

// GET
exports.getProfile= async(req , res)=> {
    try{
        const userId= req.user.userId;
        const user = await user.findById(userID).select('-password');

        if(!user){
            return res.status(404).json({message: 'MESSAGES.USER_NOT_FOUND'});
        }
        res.status(200).json({user});  
        //get user response
    }catch(err){
        console.error(err);
        res.status(500).json({message:'Server Error'});
    }
};