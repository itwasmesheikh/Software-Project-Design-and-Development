import { Router } from 'express';
import { body } from 'express-validator';
import { User } from '../models';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { AppError } from '../utils/appError';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/express';

const router = Router();

// Signup validation
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('Email already in use');
      }
      return true;
    }),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Login validation
const loginValidation = [
  body('email').trim().isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Signup route
router.post('/signup', signupValidation, validate, async (req: AuthRequest, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();

    if (!process.env.JWT_SECRET) {
      return next(new AppError('JWT secret is not configured', 500));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
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
  } catch (err) {
    next(err);
  }
});

// Login route
router.post('/login', loginValidation, validate, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Invalid email or password', 401));
    }

    if (!process.env.JWT_SECRET) {
      return next(new AppError('JWT secret is not configured', 500));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
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
  } catch (err) {
    next(err);
  }
});

// Get current user route
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const authReq = req as AuthRequest;
    res.json({
      success: true,
      data: {
        user: authReq.user,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Logout route
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    // For JWT, logout is stateless - client should remove token
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
