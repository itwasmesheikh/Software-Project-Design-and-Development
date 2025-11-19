import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';
import { AppError } from '../utils/appError';

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Invalid credentials', 401));
    }

    const token = jwt.sign(
      { userId: user.id },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({ user, token });
  } catch (error) {
    next(new AppError('Error logging in', 500));
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('User already exists', 400));
    }

    const user = new User({
      name,
      email,
      password,
      role,
      verificationStatus: 'not-started'
    });

    await user.save();

    const token = jwt.sign(
      { userId: user.id },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    next(new AppError('Error creating user', 500));
  }
});

export default router;