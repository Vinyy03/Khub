const express = require('express');
const router = express.Router();
const { register, login, updateUser } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.put('/update-profile', verifyToken, updateUser); // Add this route

module.exports = router;