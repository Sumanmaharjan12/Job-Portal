// auth.controller
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const {MESSAGES, TOKENS } = require('../constants');

// post Signup
const signup = async (req, res) =>{
    try{
        const{name,email,password,role}=req.body;
         const emailLower = email.toLowerCase(); 
            if (!name || name.length < 8) {
      return res.status(400).json({ message: 'Name must be at least 8 characters long.' });
    }

    const emailRegex = /^[a-zA-Z0-9]+@gmail\.com$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'Email already registered'});
        }
        
        const newUser= await User.create({
            name,
            email:emailLower,
            password,
            role
        });
        res.status(201).json({message: 'User registered successfully', newUser});
        }catch(error){
            console.log(error);
            res.status(500).json({message:'server error'});
        }
    };
// Post Login
const login =async(req,res)=>{
    try{
        const {email,password}=req.body;
    

        const user =await User.findOne({ email: email.toLowerCase()});
        if(!user){
            return res.status(401).json({message: MESSAGES.USER_NOT_FOUND});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message:MESSAGES.INVALID_CREDENTIALS});
        }
        const token = jwt.sign(
            {
                userId: user.id,
                 role:user.role
            },
            TOKENS.JWT_SECRET,
            {
                expiresIn: TOKENS.EXPIRES_IN
            }
        );
        res.status(200).json({
            token,
            user:{
                id: user.id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });
    }catch(err){
        console.error(err);
        res.status(500).json({message:'Server error'});
    }
};
module.exports={signup,login};