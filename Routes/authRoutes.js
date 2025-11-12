const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route
router.post('/login', authController.login);

// Logout route (optional)
router.post('/logout', authController.logout);

module.exports = router;