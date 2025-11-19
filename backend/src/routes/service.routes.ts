import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { Service } from '../models';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../types/express';

const router = Router();

// Service validation
const serviceValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
];

// Get all services
router.get('/', async (req, res, next) => {
  try {
    const services = await Service.find().select('-__v');

    res.json({
      success: true,
      data: {
        services,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get services by category
router.get('/category/:category', async (req, res, next) => {
  try {
    const services = await Service.find({
      category: req.params.category,
    }).select('-__v');

    res.json({
      success: true,
      data: {
        services,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get single service
router.get('/:id', async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).select('-__v');

    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    res.json({
      success: true,
      data: {
        service,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Create service (admin only)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  serviceValidation,
  validate,
  async (req: AuthRequest, res, next) => {
    try {
      const { name, description, category, price, duration } = req.body;

      const service = new Service({
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
    } catch (err) {
      next(err);
    }
  }
);

// Update service (admin only)
router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  serviceValidation,
  validate,
  async (req: AuthRequest, res, next) => {
    try {
      const { name, description, category, price, duration } = req.body;

      const service = await Service.findById(req.params.id);
      if (!service) {
        return next(new AppError('Service not found', 404));
      }

      if (name) service.name = name;
      if (description) service.description = description;
      if (category) service.category = category;
      if (price) service.price = price;
      if (duration) service.duration = duration;

      await service.save();

      res.json({
        success: true,
        data: {
          service,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// Delete service (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    await service.deleteOne();

    res.json({
      success: true,
      data: null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;