const express = require("express");
const router = express.Router();
const jobCategory = require("../controllers/jobCategoryContoller");
const authenticate = require("../middleware/auth.middleware");

router.get("/getcategories" ,authenticate, jobCategory.getAllCategories);
router.post("/addcategory",authenticate, jobCategory.addCategory);

module.exports = router;