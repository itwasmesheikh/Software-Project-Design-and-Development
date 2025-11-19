import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import { connectDB } from './db/connection';
import routes from './routes';
import { errorHandler } from './middleware/error';
// Initialize environment variables
dotenv.config();
// Create Express app
const app = express();
// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// API routes
app.use('/api', routes);
// Error handling middleware
app.use(errorHandler);
// Define port
const PORT = process.env.PORT || 3000;
// Start server
const startServer = async () => {
  try {
    // Try to connect to MongoDB, but don't fail if it doesn't work
    try {
      await connectDB();
    } catch (dbError) {
      console.warn('Database connection failed, but server will continue:', dbError.message);
    }
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    // Handle unhandled rejections
    process.on('unhandledRejection', (err: Error) => {
      console.log('UNHANDLED REJECTION! Shutting down...');
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};
startServer();
