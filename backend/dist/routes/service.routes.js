"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const models_1 = require("../models");
const appError_1 = require("../utils/appError");
const router = (0, express_1.Router)();
const serviceValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('description').trim().notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('category').trim().notEmpty().withMessage('Category is required'),
    (0, express_validator_1.body)('price').isNumeric().withMessage('Price must be a number'),
    (0, express_validator_1.body)('duration').trim().notEmpty().withMessage('Duration is required'),
];
router.get('/', async (req, res, next) => {
    try {
        const services = await models_1.Service.find().select('-__v');
        res.json({
            success: true,
            data: {
                services,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.get('/category/:category', async (req, res, next) => {
    try {
        const services = await models_1.Service.find({
            category: req.params.category,
        }).select('-__v');
        res.json({
            success: true,
            data: {
                services,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const service = await models_1.Service.findById(req.params.id).select('-__v');
        if (!service) {
            return next(new appError_1.AppError('Service not found', 404));
        }
        res.json({
            success: true,
            data: {
                service,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), serviceValidation, validate_1.validate, async (req, res, next) => {
    try {
        const { name, description, category, price, duration } = req.body;
        const service = new models_1.Service({
            name,
            description,
            category,
            price,
            duration,
        });
        await service.save();
        res.status(201).json({
            success: true,
            data: {
                service,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.patch('/:id', auth_1.authenticate, (0, auth_1.authorize)('admin'), serviceValidation, validate_1.validate, async (req, res, next) => {
    try {
        const { name, description, category, price, duration } = req.body;
        const service = await models_1.Service.findById(req.params.id);
        if (!service) {
            return next(new appError_1.AppError('Service not found', 404));
        }
        if (name)
            service.name = name;
        if (description)
            service.description = description;
        if (category)
            service.category = category;
        if (price)
            service.price = price;
        if (duration)
            service.duration = duration;
        await service.save();
        res.json({
            success: true,
            data: {
                service,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('admin'), async (req, res, next) => {
    try {
        const service = await models_1.Service.findById(req.params.id);
        if (!service) {
            return next(new appError_1.AppError('Service not found', 404));
        }
        await service.deleteOne();
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
//# sourceMappingURL=service.routes.js.map