import mongoose, { Document, Schema } from 'mongoose';
import { IService } from './Service';
import { VerificationStatus } from './User';

export interface IContractor extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  profileImage: string;
  rating: number;
  location: string;
  services: IService['_id'][];
  availability: string[];
  verificationStatus: VerificationStatus;
}

const contractorSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  location: {
    type: String,
    required: true,
  },
  services: [{
    type: Schema.Types.ObjectId,
    ref: 'Service',
  }],
  availability: [{
    type: String,
  }],
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'not-started'],
    default: 'not-started',
  },
}, {
  timestamps: true,
});

export const Contractor = mongoose.model<IContractor>('Contractor', contractorSchema);