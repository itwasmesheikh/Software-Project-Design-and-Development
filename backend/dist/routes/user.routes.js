"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const models_1 = require("../models");
const appError_1 = require("../utils/appError");
const router = (0, express_1.Router)();
const updateUserValidation = [
    (0, express_validator_1.body)('name').trim().optional().notEmpty().withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('email')
        .trim()
        .optional()
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom(async (value, { req }) => {
        const user = await models_1.User.findOne({ email: value });
        if (user && user._id.toString() !== req.user._id.toString()) {
            throw new Error('Email already in use');
        }
        return true;
    }),
    (0, express_validator_1.body)('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), async (req, res, next) => {
    try {
        const users = await models_1.User.find().select('-password');
        res.json({
            success: true,
            data: {
                users,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.get('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const authReq = req;
        const user = await models_1.User.findById(req.params.id).select('-password');
        if (!user) {
            return next(new appError_1.AppError('User not found', 404));
        }
        if (authReq.user.role !== 'admin' && authReq.user._id.toString() !== req.params.id) {
            return next(new appError_1.AppError('Not authorized', 403));
        }
        res.json({
            success: true,
            data: {
                user,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.patch('/:id', auth_1.authenticate, updateUserValidation, validate_1.validate, async (req, res, next) => {
    try {
        const authReq = req;
        if (authReq.user._id.toString() !== req.params.id) {
            return next(new appError_1.AppError('Not authorized', 403));
        }
        const { name, email, password } = req.body;
        const user = await models_1.User.findById(req.params.id);
        if (!user) {
            return next(new appError_1.AppError('User not found', 404));
        }
        if (name)
            user.name = name;
        if (email)
            user.email = email;
        if (password)
            user.password = password;
        await user.save();
        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.delete('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const authReq = req;
        if (authReq.user.role !== 'admin' && authReq.user._id.toString() !== req.params.id) {
            return next(new appError_1.AppError('Not authorized', 403));
        }
        const user = await models_1.User.findByIdAndDelete(req.params.id);
        if (!user) {
            return next(new appError_1.AppError('User not found', 404));
        }
        res.json({
            success: true,
            data: null,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map