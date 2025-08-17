const mongoose = require("mongoose");

const jobCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
    icon: { type: String, default: '/uploads/category.jpg' },
    createdAt:{ type: Date, default: Date.now},
});

module.exports = mongoose.model("JobCategory", jobCategorySchema);