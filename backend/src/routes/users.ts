import express from 'express';
import { User } from '../models/User';
import { AppError } from '../utils/appError';

const router = express.Router();

// Get all users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(new AppError('Error fetching users', 500));
  }
});

// Get user by ID
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.json(user);
  } catch (error) {
    next(new AppError('Error fetching user', 500));
  }
});

// Update user
router.put('/:id', async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select('-password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json(user);
  } catch (error) {
    next(new AppError('Error updating user', 500));
  }
});

// Update verification status
router.put('/:id/verification', async (req, res, next) => {
  try {
    const { verificationStatus } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { verificationStatus },
      { new: true }
    ).select('-password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json(user);
  } catch (error) {
    next(new AppError('Error updating verification status', 500));
  }
});

export default router;