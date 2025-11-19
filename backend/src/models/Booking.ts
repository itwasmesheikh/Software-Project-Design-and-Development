import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IContractor } from './Contractor';
import { IService } from './Service';

export interface IBooking extends Document {
  client: IUser['_id'];
  contractor: IContractor['_id'];
  service: IService['_id'];
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduledDate: Date;
  scheduledTime: string;
  totalPrice: number;
  location: string;
  additionalNotes?: string;
}

const bookingSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contractor: {
    type: Schema.Types.ObjectId,
    ref: 'Contractor',
    required: true,
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  scheduledTime: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  additionalNotes: {
    type: String,
  },
}, {
  timestamps: true,
});

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);