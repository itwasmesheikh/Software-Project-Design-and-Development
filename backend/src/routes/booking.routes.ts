import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { Booking, Service, Contractor } from '../models';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../types/express';

const router = Router();

// Booking validation
const bookingValidation = [
  body('contractorId').trim().notEmpty().withMessage('Contractor ID is required'),
  body('serviceId').trim().notEmpty().withMessage('Service ID is required'),
  body('scheduledDate').isISO8601().withMessage('Invalid date format'),
  body('scheduledTime').trim().notEmpty().withMessage('Scheduled time is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
];

// Get all bookings (admin only)
router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const authReq = req as AuthRequest;
    const bookings = await Booking.find()
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
  } catch (err) {
    next(err);
  }
});

// Get user bookings (client or contractor)
router.get('/my-bookings', authenticate, async (req, res, next) => {
  try {
    const authReq = req as AuthRequest;
    let bookings;

    if (authReq.user.role === 'client') {
      bookings = await Booking.find({ client: authReq.user._id })
        .populate('contractor', 'name')
        .populate('service', 'name price')
        .select('-__v');
    } else if (authReq.user.role === 'contractor') {
      const contractor = await Contractor.findOne({ user: authReq.user._id });
      if (!contractor) {
        return next(new AppError('Contractor profile not found', 404));
      }

      bookings = await Booking.find({ contractor: contractor._id })
        .populate('client', 'name email')
        .populate('service', 'name price')
        .select('-__v');
    } else {
      return next(new AppError('Invalid user role', 400));
    }

    res.json({
      success: true,
      data: {
        bookings,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get single booking
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const authReq = req as AuthRequest;
    const booking = await Booking.findById(req.params.id)
      .populate('client', 'name email')
      .populate('contractor', 'name')
      .populate('service', 'name price')
      .select('-__v');

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check if user is admin, booking client, or booking contractor
    if (
      (authReq.user.role || '') !== 'admin' &&
      booking.client._id.toString() !== authReq.user._id.toString() &&
      booking.contractor.user.toString() !== authReq.user._id.toString()
    ) {
      return next(new AppError('Not authorized', 403));
    }

    res.json({
      success: true,
      data: {
        booking,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Create booking (client only)
router.post(
  '/',
  authenticate,
  authorize('client'),
  bookingValidation,
  validate,
  async (req: AuthRequest, res, next) => {
    try {
      const authReq = req as AuthRequest;
      const { contractorId, serviceId, scheduledDate, scheduledTime, location, additionalNotes } = req.body;

      // Check if contractor exists
      const contractor = await Contractor.findById(contractorId);
      if (!contractor) {
        return next(new AppError('Contractor not found', 404));
      }

      // Check if service exists
      const service = await Service.findById(serviceId);
      if (!service) {
        return next(new AppError('Service not found', 404));
      }

      // Check if service is offered by contractor
      if (!contractor.services.includes(serviceId)) {
        return next(new AppError('Service not offered by this contractor', 400));
      }

      const booking = new Booking({
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
    } catch (err) {
      next(err);
    }
  }
);

// Update booking status (contractor or admin)
router.patch(
  '/:id/status',
  authenticate,
  [body('status').isIn(['confirmed', 'completed', 'cancelled']).withMessage('Invalid status')],
  validate,
  async (req: AuthRequest, res, next) => {
    try {
      const authReq = req as AuthRequest;
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return next(new AppError('Booking not found', 404));
      }

      // Check if user is admin or the contractor of this booking
      if (
        (authReq.user.role || '') !== 'admin' &&
        booking.contractor.toString() !== authReq.user._id.toString()
      ) {
        return next(new AppError('Not authorized', 403));
      }

      booking.status = req.body.status;
      await booking.save();

      res.json({
        success: true,
        data: {
          booking,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// Cancel booking (client or contractor)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const authReq = req as AuthRequest;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check if user is the booking client or contractor
    if (
      booking.client.toString() !== authReq.user._id.toString() &&
      booking.contractor.toString() !== authReq.user._id.toString()
    ) {
      return next(new AppError('Not authorized', 403));
    }

    // Only allow cancellation of pending or confirmed bookings
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return next(new AppError('Cannot cancel completed or already cancelled bookings', 400));
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      data: null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;