const express = require("express");
const router = express.Router();
const adminJobController = require("../controllers/adminJobController");

router.get("/jobs",adminJobController.getAllJobs);

router.put("/jobs/:id/status",adminJobController.updateJobStatus);

module.exports = router;