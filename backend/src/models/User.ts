import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'not-started';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'contractor' | 'admin' | null;
  verificationStatus: VerificationStatus;
  active: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['client', 'contractor', 'admin', null],
    default: null,
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'not-started'],
    default: 'not-started',
  },
  active: {
    type: Boolean,
    default: true,
    select: false, // Hide by default
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export const User = mongoose.model<IUser>('User', userSchema);