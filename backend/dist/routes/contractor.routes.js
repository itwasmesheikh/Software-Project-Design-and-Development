"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const models_1 = require("../models");
const appError_1 = require("../utils/appError");
const router = (0, express_1.Router)();
const contractorProfileValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('location').trim().notEmpty().withMessage('Location is required'),
    (0, express_validator_1.body)('services').isArray().withMessage('Services must be an array'),
    (0, express_validator_1.body)('availability').isArray().withMessage('Availability must be an array'),
];
router.get('/', async (req, res, next) => {
    try {
        const contractors = await models_1.Contractor.find()
            .populate('services', 'name description price')
            .select('-__v');
        res.json({
            success: true,
            data: {
                contractors,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const contractor = await models_1.Contractor.findById(req.params.id)
            .populate('services', 'name description price')
            .select('-__v');
        if (!contractor) {
            return next(new appError_1.AppError('Contractor not found', 404));
        }
        res.json({
            success: true,
            data: {
                contractor,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('contractor'), contractorProfileValidation, validate_1.validate, async (req, res, next) => {
    try {
        const authReq = req;
        const { name, location, services, availability } = req.body;
        const existingContractor = await models_1.Contractor.findOne({ user: authReq.user._id });
        if (existingContractor) {
            return next(new appError_1.AppError('Contractor profile already exists', 400));
        }
        const contractor = new models_1.Contractor({
            user: authReq.user._id,
            name,
            location,
            services,
            availability,
            rating: 0,
            verificationStatus: 'pending',
        });
        await contractor.save();
        res.status(201).json({
            success: true,
            data: {
                contractor,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.patch('/:id', auth_1.authenticate, (0, auth_1.authorize)('contractor'), contractorProfileValidation, validate_1.validate, async (req, res, next) => {
    try {
        const authReq = req;
        const contractor = await models_1.Contractor.findById(req.params.id);
        if (!contractor) {
            return next(new appError_1.AppError('Contractor not found', 404));
        }
        if (contractor.user.toString() !== authReq.user._id.toString()) {
            return next(new appError_1.AppError('Not authorized', 403));
        }
        const { name, location, services, availability } = req.body;
        contractor.name = name || contractor.name;
        contractor.location = location || contractor.location;
        contractor.services = services || contractor.services;
        contractor.availability = availability || contractor.availability;
        await contractor.save();
        res.json({
            success: true,
            data: {
                contractor,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.patch('/:id/verify', auth_1.authenticate, (0, auth_1.authorize)('admin'), [(0, express_validator_1.body)('status').isIn(['verified', 'rejected']).withMessage('Invalid status')], validate_1.validate, async (req, res, next) => {
    try {
        const { status } = req.body;
        const contractor = await models_1.Contractor.findById(req.params.id);
        if (!contractor) {
            return next(new appError_1.AppError('Contractor not found', 404));
        }
        contractor.verificationStatus = status;
        await contractor.save();
        res.json({
            success: true,
            data: {
                contractor,
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
        const contractor = await models_1.Contractor.findById(req.params.id);
        if (!contractor) {
            return next(new appError_1.AppError('Contractor not found', 404));
        }
        if ((authReq.user.role || '') !== 'admin' &&
            contractor.user.toString() !== authReq.user._id.toString()) {
            return next(new appError_1.AppError('Not authorized', 403));
        }
        await contractor.deleteOne();
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
//# sourceMappingURL=contractor.routes.js.map