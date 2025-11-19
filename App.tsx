import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { ServiceListing } from './components/ServiceListing';
import { BookingPage } from './components/BookingPage';
import { JobCardPage } from './components/JobCardPage';
import { ContractorDashboard } from './components/ContractorDashboard';
import { LoginSignup } from './components/LoginSignup';
import { VerificationPage } from './components/VerificationPage';
import { JobsPage } from './components/JobsPage';

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

export interface JobApplication {
  id: string;
  jobId: string;
  contractorId: string;
  contractorName: string;
  contractorRating: number;
  contractorImage: string;
  appliedDate: string;
  proposal: string;
  verificationStatus?: VerificationStatus;
}

export interface JobCard {
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

export type Page = 'home' | 'services' | 'booking' | 'job-cards' | 'dashboard' | 'login' | 'verification' | 'jobs';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage(userData.role === 'contractor' ? 'dashboard' : 'home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const handleBookService = (contractor: Contractor, service: Service) => {
    setSelectedContractor(contractor);
    setSelectedService(service);
    setCurrentPage('booking');
  };

  const handleBookingSubmit = (bookingData: any) => {
    const newJobCard: JobCard = {
      id: `JOB-${Date.now()}`,
      clientId: user?.id || 'client-1',
      contractorId: selectedContractor?.id || '',
      serviceId: selectedService?.id || '',
      clientName: user?.name || 'John Doe',
      contractorName: selectedContractor?.name || '',
      serviceName: selectedService?.name || '',
      date: bookingData.date,
      time: bookingData.time,
      address: bookingData.address,
      status: 'pending',
      cost: selectedService?.price || 0,
      notes: bookingData.notes
    };
    
    setJobCards([...jobCards, newJobCard]);
    setCurrentPage('job-cards');
  };

  const updateJobStatus = (jobId: string, status: JobCard['status']) => {
    setJobCards(jobCards.map(job => 
      job.id === jobId ? { ...job, status } : job
    ));
  };

  const updateVerificationStatus = (status: VerificationStatus) => {
    if (user) {
      setUser({ ...user, verificationStatus: status });
    }
  };

  const handleJobPost = (jobData: Omit<Job, 'id' | 'postedDate' | 'applicants' | 'clientName'>) => {
    const newJob: Job = {
      ...jobData,
      id: `JOB-${Date.now()}`,
      postedDate: new Date().toISOString(),
      applicants: [],
      clientName: user?.name || 'Client'
    };
    setJobs([...jobs, newJob]);
    setCurrentPage('jobs');
  };

  const handleJobApplication = (jobId: string, proposal: string) => {
    if (!user) return;
    
    const application: JobApplication = {
      id: `APP-${Date.now()}`,
      jobId,
      contractorId: user.id,
      contractorName: user.name,
      contractorRating: 4.5, // Mock rating
      contractorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      appliedDate: new Date().toISOString(),
      proposal,
      verificationStatus: user.verificationStatus
    };

    setJobs(jobs.map(job => 
      job.id === jobId 
        ? { ...job, applicants: [...job.applicants, application] }
        : job
    ));
  };

  const handleJobAssignment = (jobId: string, contractorId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId 
        ? { ...job, status: 'assigned', assignedContractorId: contractorId }
        : job
    ));
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={setCurrentPage} onBookService={handleBookService} />;
      case 'services':
        return <ServiceListing onBookService={handleBookService} />;
      case 'booking':
        return (
          <BookingPage
            contractor={selectedContractor}
            service={selectedService}
            onSubmit={handleBookingSubmit}
            onBack={() => setCurrentPage('services')}
          />
        );
      case 'job-cards':
        return (
          <JobCardPage
            jobCards={jobCards}
            currentUser={user}
            onUpdateStatus={updateJobStatus}
          />
        );
      case 'dashboard':
        return (
          <ContractorDashboard
            contractorId={user?.id || ''}
            jobCards={jobCards}
            onUpdateStatus={updateJobStatus}
          />
        );
      case 'login':
        return <LoginSignup onLogin={handleLogin} />;
      case 'verification':
        return (
          <VerificationPage
            user={user}
            onVerificationUpdate={updateVerificationStatus}
            onBack={() => setCurrentPage(user?.role === 'contractor' ? 'dashboard' : 'home')}
          />
        );
      case 'jobs':
        return (
          <JobsPage
            user={user}
            jobs={jobs}
            selectedJob={selectedJob}
            onJobSelect={setSelectedJob}
            onJobPost={handleJobPost}
            onJobApplication={handleJobApplication}
            onJobAssignment={handleJobAssignment}
            onNavigate={setCurrentPage}
          />
        );
      default:
        return <LandingPage onNavigate={setCurrentPage} onBookService={handleBookService} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
}