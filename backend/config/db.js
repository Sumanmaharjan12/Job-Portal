// configuration
require('dotenv').config();
const mongoose= require('mongoose');

const connectDB= async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB is connected:${conn.connection.host}`);
    }catch(error){
        console.log(`Error: ${error.message}`)
        process.exit(1);
    }
};
module.exports=connectDB;