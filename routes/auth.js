const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Correct way to define a POST route with a callback function
router.post('/signup', authController.signup);

// If you have a login route, it should be defined similarly
router.post('/login', authController.login);

module.exports = router;