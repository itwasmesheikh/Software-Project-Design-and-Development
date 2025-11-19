export type UserRole = 'client' | 'contractor' | null;
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'not-started';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verificationStatus?: VerificationStatus;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
}

export interface Contractor {
  id: string;
  name: string;
  profileImage: string;
  rating: number;
  location: string;
  services: Service[];
  availability: string[];
  verificationStatus?: VerificationStatus;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  client: string | User;
  contractor?: string | Contractor;
  createdAt: string;
  updatedAt: string;
}

export interface JobCard {
  id: string;
  job: Job;
  contractor: Contractor;
  status: 'applied' | 'accepted' | 'rejected';
  proposedPrice: number;
  message: string;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  job: Job;
  contractor: Contractor;
  status: 'pending' | 'accepted' | 'rejected';
  proposedPrice: number;
  message: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  client: string | User;
  contractor: string | Contractor;
  service: string | Service;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduledDate: string;
  scheduledTime: string;
  totalPrice: number;
  location: string;
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
}
