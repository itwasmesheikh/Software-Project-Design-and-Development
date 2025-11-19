import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  nodeEnv: string;
  port: number;
  mongoUri: string;
  jwtSecret: string;
  corsOrigin: string;
  awsConfig: {
    bucketName: string;
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  };
  smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
}

export const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://numansheikh:%40322442%40322442%40@cluster0.jse38si.mongodb.net/HandyGo',
  jwtSecret: process.env.JWT_SECRET || 'your-default-jwt-secret',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  awsConfig: {
    bucketName: process.env.AWS_BUCKET_NAME || '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
};