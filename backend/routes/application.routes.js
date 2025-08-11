const express = require('express');
const router = express.Router();

const applicationController = require('../controllers/application.controller');
const authenticate = require('../middleware/auth.middleware');

router.post('/applyjob',authenticate,applicationController.applyJob);
router.get('/getApplications',authenticate,applicationController.getApplications);
router.put('/update-status/:applicationId',authenticate,applicationController.updateApplications );
router.delete('/delete-application/:applicationId',authenticate,applicationController.deleteApplications );

module.exports = router;