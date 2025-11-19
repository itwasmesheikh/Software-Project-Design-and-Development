import mongoose, { Document, Schema } from 'mongoose';
import { JobApplication } from './JobApplication';

export interface IJob extends Document {
  clientId: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  deadline: string;
  status: 'open' | 'assigned' | 'completed';
  postedDate: string;
  clientName: string;
  applicants: JobApplication[];
  assignedContractorId?: string;
}

const jobSchema = new Schema({
  clientId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  deadline: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'completed'],
    default: 'open',
  },
  postedDate: {
    type: String,
    default: () => new Date().toISOString(),
  },
  clientName: {
    type: String,
    required: true,
  },
  applicants: [{
    type: Schema.Types.ObjectId,
    ref: 'JobApplication',
  }],
  assignedContractorId: {
    type: String,
  },
}, {
  timestamps: true,
});

export const Job = mongoose.model<IJob>('Job', jobSchema);