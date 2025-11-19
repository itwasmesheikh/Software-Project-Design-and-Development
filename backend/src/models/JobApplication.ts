import mongoose, { Document, Schema } from 'mongoose';
import { VerificationStatus } from './User';

export interface JobApplication extends Document {
  jobId: string;
  contractorId: string;
  contractorName: string;
  contractorRating: number;
  contractorImage: string;
  appliedDate: string;
  proposal: string;
  verificationStatus?: VerificationStatus;
}

const jobApplicationSchema = new Schema({
  jobId: {
    type: String,
    required: true,
  },
  contractorId: {
    type: String,
    required: true,
  },
  contractorName: {
    type: String,
    required: true,
  },
  contractorRating: {
    type: Number,
    required: true,
  },
  contractorImage: {
    type: String,
    required: true,
  },
  appliedDate: {
    type: String,
    default: () => new Date().toISOString(),
  },
  proposal: {
    type: String,
    required: true,
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'not-started'],
    default: 'not-started',
  },
}, {
  timestamps: true,
});

export const JobApplication = mongoose.model<JobApplication>('JobApplication', jobApplicationSchema);