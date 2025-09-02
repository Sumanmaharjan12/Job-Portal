const express = require('express');
const router = express.Router();

const adminApplicationController = require('../controllers/adminapplication');
const authenticate = require('../middleware/auth.middleware');

router.get('/getapplications', authenticate, adminApplicationController.getAllApplicationsForAdmin);

module.exports = router;