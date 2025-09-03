const express = require('express');
const { registerUser, loginUser, getCurrentUser } = require('../controllers/auth.controller');
const verifyJWT = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Route
router.get('/me', verifyJWT, getCurrentUser);

module.exports = router;
