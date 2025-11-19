import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Progress } from './ui/progress';
import { 
  DollarSign, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  TrendingUp,
  CheckCircle,
  PlayCircle,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import type { JobCard } from '../App';

interface ContractorDashboardProps {
  contractorId: string;
  jobCards: JobCard[];
  onUpdateStatus: (jobId: string, status: JobCard['status']) => void;
}

export function ContractorDashboard({ contractorId, jobCards, onUpdateStatus }: ContractorDashboardProps) {
  const contractorJobs = jobCards.filter(job => job.contractorId === contractorId);
  
  const pendingJobs = contractorJobs.filter(job => job.status === 'pending');
  const inProgressJobs = contractorJobs.filter(job => job.status === 'in-progress');
  const completedJobs = contractorJobs.filter(job => job.status === 'completed');
  
  const totalEarnings = completedJobs.reduce((sum, job) => sum + job.cost, 0);
  const monthlyTarget = 5000; // Mock monthly target
  const progressPercentage = (totalEarnings / monthlyTarget) * 100;

  const todayJobs = contractorJobs.filter(job => isToday(new Date(job.date)));
  const tomorrowJobs = contractorJobs.filter(job => isTomorrow(new Date(job.date)));

  const getStatusColor = (status: JobCard['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDateLabel = (date: string) => {
    const jobDate = new Date(date);
    if (isToday(jobDate)) return 'Today';
    if (isTomorrow(jobDate)) return 'Tomorrow';
    return format(jobDate, 'MMM dd');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contractor Dashboard</h1>
          <p className="text-gray-600">Manage your jobs and track your performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">{pendingJobs.length}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">In Progress</p>
                      <p className="text-2xl font-bold text-blue-600">{inProgressJobs.length}</p>
                    </div>
                    <PlayCircle className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{completedJobs.length}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Jobs</p>
                      <p className="text-2xl font-bold text-gray-900">{contractorJobs.length}</p>
                    </div>
                    <CalendarIcon className="h-8 w-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Earnings Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Monthly Earnings Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">${totalEarnings}</span>
                    <span className="text-sm text-gray-600">Goal: ${monthlyTarget}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{Math.round(progressPercentage)}% of monthly goal</span>
                    <span className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {progressPercentage > 50 ? 'On track' : 'Needs attention'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Job Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contractorJobs.slice(0, 5).map(job => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">#{job.id}</h4>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{job.serviceName}</p>
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {job.clientName}
                          </span>
                          <span className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {getDateLabel(job.date)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {job.time}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">${job.cost}</span>
                        {job.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => onUpdateStatus(job.id, 'in-progress')}
                          >
                            Start
                          </Button>
                        )}
                        {job.status === 'in-progress' && (
                          <Button
                            size="sm"
                            onClick={() => onUpdateStatus(job.id, 'completed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {contractorJobs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No jobs assigned yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayJobs.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No jobs scheduled for today</p>
                ) : (
                  <div className="space-y-3">
                    {todayJobs.map(job => (
                      <div key={job.id} className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{job.time}</span>
                          <Badge size="sm" className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-900">{job.serviceName}</p>
                        <p className="text-xs text-gray-600 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.address.split(',')[0]}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tomorrow's Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Tomorrow's Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                {tomorrowJobs.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No jobs scheduled for tomorrow</p>
                ) : (
                  <div className="space-y-2">
                    {tomorrowJobs.map(job => (
                      <div key={job.id} className="p-2 border rounded">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{job.time}</span>
                          <span className="text-xs text-gray-500">${job.cost}</span>
                        </div>
                        <p className="text-xs text-gray-600">{job.serviceName}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Calendar Widget */}
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  className="rounded-md border-0"
                  modifiers={{
                    hasJob: contractorJobs.map(job => new Date(job.date))
                  }}
                  modifiersStyles={{
                    hasJob: { backgroundColor: '#3b82f6', color: 'white', borderRadius: '50%' }
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}