const JobCategory = require("../models/jobcategory");

const getAllCategories = async (req, res) => {
    try{
        const categories = await JobCategory.find().sort({name:1});
        res.json(categories);
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server error fetching categories"});
    }
};

const addCategory = async (req, res) => {
    try{
       const{name} = req.body;
       
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
        }
        const defaultIcon = "/uploads/category.jpg"
        const category = new JobCategory({name, icon:defaultIcon});
        await category.save();
        res.json({message:"Category added successfully", category});
    }catch (err){
        console.error(err);
        res.status(500).json({message:"Failed to add category"});
    }
};

module.exports = {getAllCategories, addCategory}