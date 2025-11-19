import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { Contractor, User } from '../models';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../types/express';

const router = Router();

// Create/update contractor profile validation
const contractorProfileValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('services').isArray().withMessage('Services must be an array'),
  body('availability').isArray().withMessage('Availability must be an array'),
];

// Get all contractors
router.get('/', async (req, res, next) => {
  try {
    const contractors = await Contractor.find()
      .populate('services', 'name description price')
      .select('-__v');

    res.json({
      success: true,
      data: {
        contractors,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get single contractor
router.get('/:id', async (req, res, next) => {
  try {
    const contractor = await Contractor.findById(req.params.id)
      .populate('services', 'name description price')
      .select('-__v');

    if (!contractor) {
      return next(new AppError('Contractor not found', 404));
    }

    res.json({
      success: true,
      data: {
        contractor,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Create contractor profile (for authenticated contractors)
router.post(
  '/',
  authenticate,
  authorize('contractor'),
  contractorProfileValidation,
  validate,
  async (req, res, next) => {
    try {
      const authReq = req as AuthRequest;
      const { name, location, services, availability } = req.body;

      // Check if contractor profile already exists
      const existingContractor = await Contractor.findOne({ user: authReq.user._id });
      if (existingContractor) {
        return next(new AppError('Contractor profile already exists', 400));
      }

      const contractor = new Contractor({
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
    } catch (err) {
      next(err);
    }
  }
);

// Update contractor profile (for authenticated contractors)
router.patch(
  '/:id',
  authenticate,
  authorize('contractor'),
  contractorProfileValidation,
  validate,
  async (req, res, next) => {
    try {
      const authReq = req as AuthRequest;
      const contractor = await Contractor.findById(req.params.id);

      if (!contractor) {
        return next(new AppError('Contractor not found', 404));
      }

      // Check if user is the owner of the profile
      if (contractor.user.toString() !== authReq.user._id.toString()) {
        return next(new AppError('Not authorized', 403));
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
    } catch (err) {
      next(err);
    }
  }
);

// Update contractor verification status (admin only)
router.patch(
  '/:id/verify',
  authenticate,
  authorize('admin'),
  [body('status').isIn(['verified', 'rejected']).withMessage('Invalid status')],
  validate,
  async (req: AuthRequest, res, next) => {
    try {
      const { status } = req.body;

      const contractor = await Contractor.findById(req.params.id);
      if (!contractor) {
        return next(new AppError('Contractor not found', 404));
      }

      contractor.verificationStatus = status;
      await contractor.save();

      res.json({
        success: true,
        data: {
          contractor,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// Delete contractor profile (admin or owner)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const authReq = req as AuthRequest;
    const contractor = await Contractor.findById(req.params.id);
    if (!contractor) {
      return next(new AppError('Contractor not found', 404));
    }

    // Check if user is admin or owner
    if (
      (authReq.user.role || '') !== 'admin' &&
      contractor.user.toString() !== authReq.user._id.toString()
    ) {
      return next(new AppError('Not authorized', 403));
    }

    await contractor.deleteOne();

    res.json({
      success: true,
      data: null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;