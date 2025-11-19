import express from 'express';
import { Job } from '../models/Job';
import { AppError } from '../utils/appError';

const router = express.Router();

// Get all jobs
router.get('/', async (req, res, next) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    next(new AppError('Error fetching jobs', 500));
  }
});

// Create a new job
router.post('/', async (req, res, next) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    next(new AppError('Error creating job', 500));
  }
});

// Get job by ID
router.get('/:id', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return next(new AppError('Job not found', 404));
    }
    res.json(job);
  } catch (error) {
    next(new AppError('Error fetching job', 500));
  }
});

// Update job
router.put('/:id', async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    res.json(job);
  } catch (error) {
    next(new AppError('Error updating job', 500));
  }
});

// Apply for a job
router.post('/:id/applications', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    job.applicants.push(req.body);
    await job.save();

    res.status(201).json(job);
  } catch (error) {
    next(new AppError('Error applying for job', 500));
  }
});

// Assign job to contractor
router.put('/:id/assign', async (req, res, next) => {
  try {
    const { contractorId } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { 
        assignedContractorId: contractorId,
        status: 'assigned'
      },
      { new: true }
    );

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    res.json(job);
  } catch (error) {
    next(new AppError('Error assigning job', 500));
  }
});

export default router;