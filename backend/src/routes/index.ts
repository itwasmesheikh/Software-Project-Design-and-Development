import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import contractorRoutes from './contractor.routes';
import serviceRoutes from './service.routes';
import bookingRoutes from './booking.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/contractors', contractorRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);

export default router;