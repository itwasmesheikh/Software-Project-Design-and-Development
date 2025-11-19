import mongoose, { Document, Schema } from 'mongoose';

export interface IJobCard extends Document {
  id: string;
  clientId: string;
  contractorId: string;
  serviceId: string;
  clientName: string;
  contractorName: string;
  serviceName: string;
  date: string;
  time: string;
  address: string;
  status: 'pending' | 'in-progress' | 'completed';
  cost: number;
  notes?: string;
}

const jobCardSchema = new Schema({
  clientId: {
    type: String,
    required: true,
  },
  contractorId: {
    type: String,
    required: true,
  },
  serviceId: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  contractorName: {
    type: String,
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  cost: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

export const JobCard = mongoose.model<IJobCard>('JobCard', jobCardSchema);