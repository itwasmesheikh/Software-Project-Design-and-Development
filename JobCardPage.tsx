import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CalendarIcon, Clock, MapPin, User, FileText, Download, CheckCircle, PlayCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { JobCard, User as UserType } from '../App';

interface JobCardPageProps {
  jobCards: JobCard[];
  currentUser: UserType | null;
  onUpdateStatus: (jobId: string, status: JobCard['status']) => void;
}

const getStatusColor = (status: JobCard['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: JobCard['status']) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'in-progress':
      return <PlayCircle className="h-4 w-4" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <XCircle className="h-4 w-4" />;
  }
};

export function JobCardPage({ jobCards, currentUser, onUpdateStatus }: JobCardPageProps) {
  const [selectedTab, setSelectedTab] = useState('all');

  // Filter job cards based on user role and selected tab
  const filteredJobCards = jobCards.filter(job => {
    if (!currentUser) return false;
    
    const isUserJob = currentUser.role === 'client' 
      ? job.clientId === currentUser.id 
      : job.contractorId === currentUser.id;
    
    if (!isUserJob) return false;

    if (selectedTab === 'all') return true;
    return job.status === selectedTab;
  });

  const handleDownloadPDF = (job: JobCard) => {
    // Simulate PDF download
    console.log('Downloading PDF for job:', job.id);
    // In a real app, this would generate and download a PDF
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">Please log in to view your job cards</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Job Cards</h1>
          <p className="text-gray-600">
            {currentUser.role === 'client' 
              ? 'Track your service appointments and view job details'
              : 'Manage your assigned jobs and update their status'
            }
          </p>
        </div>

        {/* Status Filter Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-6 mt-6">
            {filteredJobCards.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No job cards found</h3>
                  <p className="text-gray-600">
                    {selectedTab === 'all' 
                      ? 'You don\'t have any job cards yet.' 
                      : `No jobs with status "${selectedTab}".`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredJobCards.map(job => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Job #{job.id}</CardTitle>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(job.status)} border`}
                        >
                          {getStatusIcon(job.status)}
                          <span className="ml-1 capitalize">{job.status.replace('-', ' ')}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Service Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{job.serviceName}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            <span>
                              {currentUser.role === 'client' ? job.contractorName : job.clientName}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            <span>{format(new Date(job.date), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{job.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="truncate">{job.address}</span>
                          </div>
                        </div>
                      </div>

                      {/* Cost */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Cost</span>
                          <span className="text-lg font-semibold text-gray-900">${job.cost}</span>
                        </div>
                      </div>

                      {/* Notes */}
                      {job.notes && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-1">Notes</h5>
                          <p className="text-sm text-gray-600 bg-gray-50 rounded p-2">{job.notes}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {currentUser.role === 'contractor' && (
                          <>
                            {job.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => onUpdateStatus(job.id, 'in-progress')}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <PlayCircle className="h-4 w-4 mr-1" />
                                Start Job
                              </Button>
                            )}
                            {job.status === 'in-progress' && (
                              <Button
                                size="sm"
                                onClick={() => onUpdateStatus(job.id, 'completed')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Mark Complete
                              </Button>
                            )}
                          </>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadPDF(job)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}