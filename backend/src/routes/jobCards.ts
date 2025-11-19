import express from 'express';
import { JobCard } from '../models/JobCard';
import { AppError } from '../utils/appError';

const router = express.Router();

// Get all job cards
router.get('/', async (req, res, next) => {
  try {
    const { userId, role } = req.query;
    let query = {};
    
    if (role === 'client') {
      query = { clientId: userId };
    } else if (role === 'contractor') {
      query = { contractorId: userId };
    }

    const jobCards = await JobCard.find(query);
    res.json(jobCards);
  } catch (error) {
    next(new AppError('Error fetching job cards', 500));
  }
});

// Create a new job card
router.post('/', async (req, res, next) => {
  try {
    const jobCard = new JobCard(req.body);
    await jobCard.save();
    res.status(201).json(jobCard);
  } catch (error) {
    next(new AppError('Error creating job card', 500));
  }
});

// Update job card status
router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const jobCard = await JobCard.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!jobCard) {
      return next(new AppError('Job card not found', 404));
    }

    res.json(jobCard);
  } catch (error) {
    next(new AppError('Error updating job card status', 500));
  }
});

export default router;