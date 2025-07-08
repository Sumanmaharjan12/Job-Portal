const express = require("express");
const router = express.Router();
const {postJob, getJob} = require("../controllers/jobController");

router.post("/post-job", postJob);
router.get("/get-job", getJob);  
module.exports = router;