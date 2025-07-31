const express = require('express');
const router = express.Router();

const applicationController = require('../controllers/application.controller');
const authenticate = require('../middleware/auth.middleware');

router.post('/applyjob',authenticate,applicationController.applyJob);
router.get('/getApplications',authenticate,applicationController.getApplications);
router.put('/update-status/:applicationId',authenticate,applicationController.updateApplications )

module.exports = router;