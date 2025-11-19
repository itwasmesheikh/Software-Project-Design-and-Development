import express from 'express';
import { Service } from '../models/Service';
import { AppError } from '../utils/appError';

const router = express.Router();

// Get all services
router.get('/', async (req, res, next) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    next(new AppError('Error fetching services', 500));
  }
});

// Get services by category
router.get('/category/:category', async (req, res, next) => {
  try {
    const services = await Service.find({ category: req.params.category });
    res.json(services);
  } catch (error) {
    next(new AppError('Error fetching services', 500));
  }
});

// Create a new service
router.post('/', async (req, res, next) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    next(new AppError('Error creating service', 500));
  }
});

export default router;