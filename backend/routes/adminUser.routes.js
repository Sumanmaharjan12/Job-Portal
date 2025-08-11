const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const authenticate = require('../middleware/auth.middleware');


router.get('/jobseekers', authenticate, adminUserController.getAllJobSeekers);
router.get('/jobkeepers', authenticate, adminUserController.getAllJobKeepers);
router.delete('/users/:userId',authenticate, adminUserController.deleteUserById);

module.exports = router;
