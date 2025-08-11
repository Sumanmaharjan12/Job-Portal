// backend/routes/admin-dashboard.routes.js
const express = require('express');
const router = express.Router();

const adminDashboardController = require('../controllers/admindashboard');
const authenticate = require('../middleware/auth.middleware');

// Get dashboard statistics
router.get('/dashboard', authenticate, adminDashboardController.getDashboardStats);
router.post('/add',authenticate,adminDashboardController.addAdmin);
router.get('/list',authenticate, adminDashboardController.getAllAdmin)
module.exports = router;
