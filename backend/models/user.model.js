// User models

const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');
const { type } = require('os');
const { timeStamp } = require('console');

const userSchema =new mongoose.Schema(
    {
        name: {
            type: String,
            required:true,
            trim: true,
        },
        email: {
            type:String,
            required:true,
            unique:true,
            lowercase:true,
        },
        password:{
            type:String,
            required:true,
            minlength:6,
        },
        role:{
            type:String,
            enum:['JobSeeker','JobKeeper','Admin','SuperAdmin'],
            default:'JobSeeker',
        },
        CreatedAt:{
            type:Date,
            default: Date.now,
        },
    },
    {
        timeStamp:true,
    }
);

// Hash password before saving
userSchema.pre('save',async function(next)
{
    if(!this.isModified('password')) return next();
    const salt =10;
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
// compare entered password with hased password'
userSchema.methods.comparePassword =async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('User',userSchema);