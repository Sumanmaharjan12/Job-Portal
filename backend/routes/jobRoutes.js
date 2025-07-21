const express = require("express");
const router = express.Router();
const {postJob, getJob,deleteJob, updateJob, getalljobs} = require("../controllers/jobController");

router.post("/post-job", postJob);
router.get("/get-job", getJob);  
router.get("/get-all",getalljobs)
router.post("/delete-job",deleteJob);
router.post("/update-job",updateJob)
module.exports = router;