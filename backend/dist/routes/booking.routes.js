"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const models_1 = require("../models");
const appError_1 = require("../utils/appError");
const router = (0, express_1.Router)();
const bookingValidation = [
    (0, express_validator_1.body)('contractorId').trim().notEmpty().withMessage('Contractor ID is required'),
    (0, express_validator_1.body)('serviceId').trim().notEmpty().withMessage('Service ID is required'),
    (0, express_validator_1.body)('scheduledDate').isISO8601().withMessage('Invalid date format'),
    (0, express_validator_1.body)('scheduledTime').trim().notEmpty().withMessage('Scheduled time is required'),
    (0, express_validator_1.body)('location').trim().notEmpty().withMessage('Location is required'),
];
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), async (req, res, next) => {
    try {
        const authReq = req;
        const bookings = await models_1.Booking.find()
            .populate('client', 'name email')
            .populate('contractor', 'name')
            .populate('service', 'name price')
            .select('-__v');
        res.json({
            success: true,
            data: {
                bookings,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.get('/my-bookings', auth_1.authenticate, async (req, res, next) => {
    try {
        const authReq = req;
        let bookings;
        if (authReq.user.role === 'client') {
            bookings = await models_1.Booking.find({ client: authReq.user._id })
                .populate('contractor', 'name')
                .populate('service', 'name price')
                .select('-__v');
        }
        else if (authReq.user.role === 'contractor') {
            const contractor = await models_1.Contractor.findOne({ user: authReq.user._id });
            if (!contractor) {
                return next(new appError_1.AppError('Contractor profile not found', 404));
            }
            bookings = await models_1.Booking.find({ contractor: contractor._id })
                .populate('client', 'name email')
                .populate('service', 'name price')
                .select('-__v');
        }
        else {
            return next(new appError_1.AppError('Invalid user role', 400));
        }
        res.json({
            success: true,
            data: {
                bookings,
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
        const booking = await models_1.Booking.findById(req.params.id)
            .populate('client', 'name email')
            .populate('contractor', 'name')
            .populate('service', 'name price')
            .select('-__v');
        if (!booking) {
            return next(new appError_1.AppError('Booking not found', 404));
        }
        if ((authReq.user.role || '') !== 'admin' &&
            booking.client._id.toString() !== authReq.user._id.toString() &&
            booking.contractor.user.toString() !== authReq.user._id.toString()) {
            return next(new appError_1.AppError('Not authorized', 403));
        }
        res.json({
            success: true,
            data: {
                booking,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('client'), bookingValidation, validate_1.validate, async (req, res, next) => {
    try {
        const authReq = req;
        const { contractorId, serviceId, scheduledDate, scheduledTime, location, additionalNotes } = req.body;
        const contractor = await models_1.Contractor.findById(contractorId);
        if (!contractor) {
            return next(new appError_1.AppError('Contractor not found', 404));
        }
        const service = await models_1.Service.findById(serviceId);
        if (!service) {
            return next(new appError_1.AppError('Service not found', 404));
        }
        if (!contractor.services.includes(serviceId)) {
            return next(new appError_1.AppError('Service not offered by this contractor', 400));
        }
        const booking = new models_1.Booking({
            client: authReq.user._id,
            contractor: contractorId,
            service: serviceId,
            scheduledDate,
            scheduledTime,
            location,
            additionalNotes,
            totalPrice: service.price,
            status: 'pending',
        });
        await booking.save();
        res.status(201).json({
            success: true,
            data: {
                booking,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.patch('/:id/status', auth_1.authenticate, [(0, express_validator_1.body)('status').isIn(['confirmed', 'completed', 'cancelled']).withMessage('Invalid status')], validate_1.validate, async (req, res, next) => {
    try {
        const authReq = req;
        const booking = await models_1.Booking.findById(req.params.id);
        if (!booking) {
            return next(new appError_1.AppError('Booking not found', 404));
        }
        if ((authReq.user.role || '') !== 'admin' &&
            booking.contractor.toString() !== authReq.user._id.toString()) {
            return next(new appError_1.AppError('Not authorized', 403));
        }
        booking.status = req.body.status;
        await booking.save();
        res.json({
            success: true,
            data: {
                booking,
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
        const booking = await models_1.Booking.findById(req.params.id);
        if (!booking) {
            return next(new appError_1.AppError('Booking not found', 404));
        }
        if (booking.client.toString() !== authReq.user._id.toString() &&
            booking.contractor.toString() !== authReq.user._id.toString()) {
            return next(new appError_1.AppError('Not authorized', 403));
        }
        if (!['pending', 'confirmed'].includes(booking.status)) {
            return next(new appError_1.AppError('Cannot cancel completed or already cancelled bookings', 400));
        }
        booking.status = 'cancelled';
        await booking.save();
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
//# sourceMappingURL=booking.routes.js.map