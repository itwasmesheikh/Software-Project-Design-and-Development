import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { User } from '../models';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../types/express';

const router = Router();

// Update user validation
const updateUserValidation = [
  body('name').trim().optional().notEmpty().withMessage('Name cannot be empty'),
  body('email')
    .trim()
    .optional()
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user && user._id.toString() !== req.user._id.toString()) {
        throw new Error('Email already in use');
      }
      return true;
    }),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Get all users (admin only)
router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get single user (admin or owner)
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const authReq = req as AuthRequest;
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check if user is admin or owner
    if (authReq.user.role !== 'admin' && authReq.user._id.toString() !== req.params.id) {
      return next(new AppError('Not authorized', 403));
    }

    res.json({
      success: true,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Update user (owner only)
router.patch(
  '/:id',
  authenticate,
  updateUserValidation,
  validate,
  async (req, res, next) => {
    try {
      const authReq = req as AuthRequest;
      // Check if user is owner
      if (authReq.user._id.toString() !== req.params.id) {
        return next(new AppError('Not authorized', 403));
      }

      const { name, email, password } = req.body;
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;

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
    } catch (err) {
      next(err);
    }
  }
);

// Delete user (admin or owner)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const authReq = req as AuthRequest;
    // Check if user is admin or owner
    if (authReq.user.role !== 'admin' && authReq.user._id.toString() !== req.params.id) {
      return next(new AppError('Not authorized', 403));
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      success: true,
      data: null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;