"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const models_1 = require("../models");
const validate_1 = require("../middleware/validate");
const auth_1 = require("../middleware/auth");
const appError_1 = require("../utils/appError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const signupValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom(async (value) => {
        const user = await models_1.User.findOne({ email: value });
        if (user) {
            throw new Error('Email already in use');
        }
        return true;
    }),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];
const loginValidation = [
    (0, express_validator_1.body)('email').trim().isEmail().withMessage('Please enter a valid email'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
router.post('/signup', signupValidation, validate_1.validate, async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const user = new models_1.User({
            name,
            email,
            password,
            role,
        });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.post('/login', loginValidation, validate_1.validate, async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await models_1.User.findOne({ email });
        if (!user) {
            return next(new appError_1.AppError('Invalid email or password', 401));
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new appError_1.AppError('Invalid email or password', 401));
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.get('/me', auth_1.authenticate, async (req, res, next) => {
    try {
        const authReq = req;
        res.json({
            success: true,
            data: {
                user: authReq.user,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.post('/logout', auth_1.authenticate, async (req, res, next) => {
    try {
        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map