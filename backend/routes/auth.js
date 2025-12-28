const express = require('express');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// POST /api/auth/register - Register new user
router.post('/register',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 }),
        body('name').optional().trim()
    ],
    validateRequest,
    async (req, res) => {
        try {
            const { email, password, name } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Create new user
            const user = await User.create({
                email,
                password,
                name
            });

            // Generate token
            const token = generateToken(user.id);

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: user.toJSON()
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Registration failed' });
        }
    }
);

// POST /api/auth/login - Login user
router.post('/login',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty()
    ],
    validateRequest,
    async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Validate password
            const isValid = await user.validatePassword(password);
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(403).json({ error: 'Account is inactive' });
            }

            // Update last login
            await user.update({ lastLogin: new Date() });

            // Generate token
            const token = generateToken(user.id);

            res.json({
                message: 'Login successful',
                token,
                user: user.toJSON()
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    }
);

// GET /api/auth/me - Get current user (requires authentication)
router.get('/me', require('../middleware/auth').authenticateToken, async (req, res) => {
    res.json({ user: req.user.toJSON() });
});

module.exports = router;
