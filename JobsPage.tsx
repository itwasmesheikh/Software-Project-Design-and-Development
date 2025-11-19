import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  User, 
  Star,
  Search,
  Filter,
  CheckCircle,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import type { User, Job, JobApplication, Page } from '../App';

interface JobsPageProps {
  user: User | null;
  jobs: Job[];
  selectedJob: Job | null;
  onJobSelect: (job: Job | null) => void;
  onJobPost: (jobData: Omit<Job, 'id' | 'postedDate' | 'applicants' | 'clientName'>) => void;
  onJobApplication: (jobId: string, proposal: string) => void;
  onJobAssignment: (jobId: string, contractorId: string) => void;
  onNavigate: (page: Page) => void;
}

export function JobsPage({ 
  user, 
  jobs, 
  selectedJob, 
  onJobSelect, 
  onJobPost, 
  onJobApplication, 
  onJobAssignment,
  onNavigate 
}: JobsPageProps) {
  const [showPostJobDialog, setShowPostJobDialog] = useState(false);
  const [showJobDetailDialog, setShowJobDetailDialog] = useState(false);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    location: '',
    deadline: ''
  });
  const [applicationProposal, setApplicationProposal] = useState('');

  const categories = [
    'all',
    'plumbing',
    'electrical',
    'carpentry',
    'painting',
    'hvac',
    'landscaping',
    'cleaning',
    'handyman',
    'roofing'
  ];

  const locations = [
    'all',
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA'
  ];

  // Mock data for demonstration
  const mockJobs: Job[] = jobs.length === 0 ? [
    {
      id: 'job-1',
      clientId: 'client-1',
      title: 'Kitchen Faucet Repair',
      description: 'Need a plumber to fix a leaky kitchen faucet. The issue started yesterday and water is dripping constantly.',
      category: 'plumbing',
      budget: 150,
      location: 'New York, NY',
      deadline: '2024-09-15',
      status: 'open',
      postedDate: '2024-08-28',
      clientName: 'Sarah Johnson',
      applicants: []
    },
    {
      id: 'job-2',
      clientId: 'client-2',
      title: 'Living Room Painting',
      description: 'Looking for a professional painter to paint my living room. Room is 15x12 feet with 10 foot ceilings.',
      category: 'painting',
      budget: 800,
      location: 'Los Angeles, CA',
      deadline: '2024-09-20',
      status: 'open',
      postedDate: '2024-08-27',
      clientName: 'Mike Davis',
      applicants: []
    },
    {
      id: 'job-3',
      clientId: 'client-3',
      title: 'Deck Construction',
      description: 'Need a carpenter to build a 12x16 deck in the backyard. Materials will be provided.',
      category: 'carpentry',
      budget: 2500,
      location: 'Chicago, IL',
      deadline: '2024-10-01',
      status: 'assigned',
      postedDate: '2024-08-25',
      clientName: 'Lisa Chen',
      applicants: [],
      assignedContractorId: 'contractor-1'
    }
  ] : jobs;

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const clientJobs = mockJobs.filter(job => job.clientId === user?.id);
  const contractorAppliedJobs = mockJobs.filter(job => 
    job.applicants.some(app => app.contractorId === user?.id)
  );

  const handleJobFormSubmit = () => {
    if (!user) return;
    
    onJobPost({
      clientId: user.id,
      title: jobForm.title,
      description: jobForm.description,
      category: jobForm.category,
      budget: parseFloat(jobForm.budget),
      location: jobForm.location,
      deadline: jobForm.deadline,
      status: 'open'
    });

    setJobForm({
      title: '',
      description: '',
      category: '',
      budget: '',
      location: '',
      deadline: ''
    });
    setShowPostJobDialog(false);
  };

  const handleJobApplication = () => {
    if (!selectedJob || !user) return;
    
    onJobApplication(selectedJob.id, applicationProposal);
    setApplicationProposal('');
    setShowApplicationDialog(false);
    setShowJobDetailDialog(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-100 text-green-800">Open</Badge>;
      case 'assigned':
        return <Badge className="bg-blue-100 text-blue-800">Assigned</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getVerificationBadge = (status?: string) => {
    if (status === 'verified') {
      return <Badge variant="default" className="bg-green-100 text-green-800 text-xs">✓ Verified</Badge>;
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please log in to access job listings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => onNavigate('login')} className="w-full">
              Login / Signup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderClientView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Posted Jobs</h2>
          <p className="text-gray-600">Manage your job postings and review applications</p>
        </div>
        <Dialog open={showPostJobDialog} onOpenChange={setShowPostJobDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Post a Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Post a New Job</DialogTitle>
              <DialogDescription>
                Describe your project and find the right contractor
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g., Kitchen Faucet Repair"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={jobForm.category} onValueChange={(value) => setJobForm({ ...jobForm, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={jobForm.budget}
                  onChange={(e) => setJobForm({ ...jobForm, budget: e.target.value })}
                  placeholder="150"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Select value={jobForm.location} onValueChange={(value) => setJobForm({ ...jobForm, location: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.slice(1).map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={jobForm.deadline}
                  onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Provide details about your project..."
                  rows={4}
                />
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowPostJobDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleJobFormSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Post Job
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {clientJobs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You haven't posted any jobs yet</p>
                <Button onClick={() => setShowPostJobDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                  Post Your First Job
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          clientJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{job.title}</span>
                      {getStatusBadge(job.status)}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due {formatDate(job.deadline)}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatCurrency(job.budget)}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{job.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{job.category}</Badge>
                    <span className="text-sm text-gray-500">
                      {job.applicants.length} applicant{job.applicants.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {job.applicants.length > 0 && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        onJobSelect(job);
                        setShowJobDetailDialog(true);
                      }}
                    >
                      View Applicants
                    </Button>
                  )}
                </div>

                {job.applicants.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-3">Recent Applicants</h4>
                    <div className="space-y-2">
                      {job.applicants.slice(0, 2).map((applicant) => (
                        <div key={applicant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <img
                              src={applicant.contractorImage}
                              alt={applicant.contractorName}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{applicant.contractorName}</span>
                                {getVerificationBadge(applicant.verificationStatus)}
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-sm text-gray-600">{applicant.contractorRating}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => onJobAssignment(job.id, applicant.contractorId)}
                            disabled={job.status !== 'open'}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Assign
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderContractorView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Browse Jobs</h2>
        <p className="text-gray-600">Find projects that match your skills</p>
      </div>

      <Tabs defaultValue="available" className="space-y-6">
        <TabsList>
          <TabsTrigger value="available">Available Jobs</TabsTrigger>
          <TabsTrigger value="applied">Applied Jobs ({contractorAppliedJobs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            {filteredJobs.filter(job => job.status === 'open').map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{job.title}</span>
                        {getStatusBadge(job.status)}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {job.clientName}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Due {formatDate(job.deadline)}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(job.budget)}
                      </div>
                      <div className="text-sm text-gray-500">Budget</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{job.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{job.category}</Badge>
                      <span className="text-sm text-gray-500">
                        Posted {formatDate(job.postedDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          onJobSelect(job);
                          setShowJobDetailDialog(true);
                        }}
                      >
                        View Details
                      </Button>
                      {!job.applicants.some(app => app.contractorId === user?.id) ? (
                        <Button 
                          onClick={() => {
                            onJobSelect(job);
                            setShowApplicationDialog(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Apply Now
                        </Button>
                      ) : (
                        <Button disabled variant="outline">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Applied
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applied" className="space-y-6">
          <div className="grid gap-6">
            {contractorAppliedJobs.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">You haven't applied to any jobs yet</p>
                    <Button onClick={() => document.querySelector('[value="available"]')?.click()}>
                      Browse Available Jobs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              contractorAppliedJobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{job.title}</span>
                          {getStatusBadge(job.status)}
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-2">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {job.clientName}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          {formatCurrency(job.budget)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{job.category}</Badge>
                      <span className="text-sm text-gray-500">
                        Applied {formatDate(job.applicants.find(app => app.contractorId === user?.id)?.appliedDate || '')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {user.role === 'client' ? renderClientView() : renderContractorView()}

        {/* Job Detail Dialog */}
        <Dialog open={showJobDetailDialog} onOpenChange={setShowJobDetailDialog}>
          <DialogContent className="sm:max-w-2xl">
            {selectedJob && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedJob.title}</DialogTitle>
                  <DialogDescription>
                    Posted by {selectedJob.clientName} • {formatDate(selectedJob.postedDate)}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(selectedJob.budget)}
                      </div>
                      <div className="text-sm text-gray-500">Budget</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{selectedJob.location}</div>
                      <div className="text-sm text-gray-500">Location</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{formatDate(selectedJob.deadline)}</div>
                      <div className="text-sm text-gray-500">Deadline</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-gray-600">{selectedJob.description}</p>
                  </div>

                  {user?.role === 'client' && selectedJob.applicants.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Applicants ({selectedJob.applicants.length})</h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {selectedJob.applicants.map((applicant) => (
                          <div key={applicant.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <img
                                src={applicant.contractorImage}
                                alt={applicant.contractorName}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{applicant.contractorName}</span>
                                  {getVerificationBadge(applicant.verificationStatus)}
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span className="text-sm text-gray-600">{applicant.contractorRating}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{applicant.proposal}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                onJobAssignment(selectedJob.id, applicant.contractorId);
                                setShowJobDetailDialog(false);
                              }}
                              disabled={selectedJob.status !== 'open'}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Assign
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Job Application Dialog */}
        <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Apply for Job</DialogTitle>
              <DialogDescription>
                Submit your proposal for "{selectedJob?.title}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="proposal">Your Proposal</Label>
                <Textarea
                  id="proposal"
                  value={applicationProposal}
                  onChange={(e) => setApplicationProposal(e.target.value)}
                  placeholder="Explain why you're the right person for this job..."
                  rows={4}
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowApplicationDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleJobApplication}
                  disabled={!applicationProposal.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Submit Application
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}