import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/handygo_app';

export const connectDB = async (): Promise<void> => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    const connection = mongoose.connection;
    
    connection.on('connected', () => {
      console.log('MongoDB Connected Successfully');
    });

    connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      // Don't exit here, let the error propagate to the main error handler
      throw err;
    });

    connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error; // Let the error propagate to the main error handler
  }
};