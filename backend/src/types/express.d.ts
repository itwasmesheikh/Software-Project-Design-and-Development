import { Request } from 'express';
import { Document } from 'mongoose';
import { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user: IUser & Document;
}
