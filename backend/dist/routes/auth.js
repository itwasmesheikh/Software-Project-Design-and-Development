"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const config_1 = require("../config");
const router = express_1.default.Router();
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.config.jwtSecret, { expiresIn: '24h' });
        res.json({ user, token });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = new User_1.User({
            name,
            email,
            password,
            role,
            verificationStatus: 'not-started'
        });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.config.jwtSecret, { expiresIn: '24h' });
        res.status(201).json({ user, token });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map