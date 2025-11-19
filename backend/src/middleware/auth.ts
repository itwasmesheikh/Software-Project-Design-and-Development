import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../types/express';

interface JwtPayload {
  id: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return next(new AppError('No authorization header found', 401));
    }

    if (!authHeader.startsWith('Bearer ')) {
      return next(new AppError('Invalid authorization format', 401));
    }

    const token = authHeader.replace('Bearer ', '');

    if (!process.env.JWT_SECRET) {
      return next(new AppError('JWT secret is not configured', 500));
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new AppError('Token has expired', 401));
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return next(new AppError('Invalid token', 401));
      }
      throw error;
    }

    // Get user from database
    const user = await User.findById(decoded.id).select('+active');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (!user.active) {
      return next(new AppError('User account is deactivated', 401));
    }

    // Add user to request
    (req as AuthRequest).user = user;
    next();
  } catch (err) {
    next(new AppError('Authentication failed', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    if (!authReq.user || !roles.includes(authReq.user.role || '')) {
      return next(
        new AppError(
          'You do not have permission to perform this action',
          403
        )
      );
    }
    next();
  };
};
