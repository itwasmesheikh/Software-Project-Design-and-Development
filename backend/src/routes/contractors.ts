import express from 'express';
import { Contractor } from '../models/Contractor';
import { AppError } from '../utils/appError';

const router = express.Router();

// Get all contractors
router.get('/', async (_req, res, next) => {
  try {
    const contractors = await Contractor.find();
    res.json(contractors);
  } catch (error) {
    next(new AppError('Error fetching contractors', 500));
  }
});

// Get contractor by ID
router.get('/:id', async (req, res, next) => {
  try {
    const contractor = await Contractor.findById(req.params.id);
    if (!contractor) {
      return next(new AppError('Contractor not found', 404));
    }
    res.json(contractor);
  } catch (error) {
    next(new AppError('Error fetching contractor', 500));
  }
});

// Update contractor profile
router.put('/:id', async (req, res, next) => {
  try {
    const contractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!contractor) {
      return next(new AppError('Contractor not found', 404));
    }

    res.json(contractor);
  } catch (error) {
    next(new AppError('Error updating contractor profile', 500));
  }
});

export default router;