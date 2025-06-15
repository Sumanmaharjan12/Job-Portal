// user routes

const express = require('express');
const router = express.Router();

const userController= require('../controllers/user.controller');
const authenticate = require('../middleware/auth.middleware');

router.get('/profile',authenticate,userController.getProfile);

module.exports = router;