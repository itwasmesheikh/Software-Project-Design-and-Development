import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star, MapPin, Clock, Search } from 'lucide-react';
import type { Contractor, Service } from '../App';

interface ServiceListingProps {
  onBookService: (contractor: Contractor, service: Service) => void;
}

const mockContractors: Contractor[] = [
  {
    id: 'contractor-1',
    name: 'Mike Johnson',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    location: 'Downtown District',
    availability: ['weekdays', 'weekends'],
    verificationStatus: 'verified',
    services: [
      { id: 'service-1', name: 'Emergency Plumbing', description: 'Fast response for urgent plumbing issues', category: 'Plumbing', price: 120, duration: '2-3 hours' },
      { id: 'service-2', name: 'Bathroom Installation', description: 'Complete bathroom renovation and installation', category: 'Plumbing', price: 850, duration: '3-5 days' }
    ]
  },
  {
    id: 'contractor-2',
    name: 'Sarah Williams',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b278?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    location: 'North Side',
    availability: ['weekdays'],
    verificationStatus: 'verified',
    services: [
      { id: 'service-3', name: 'Electrical Wiring', description: 'Professional electrical installation and repair', category: 'Electrical', price: 95, duration: '4-6 hours' },
      { id: 'service-4', name: 'Smart Home Setup', description: 'Installation of smart switches and outlets', category: 'Electrical', price: 200, duration: '1-2 days' }
    ]
  },
  {
    id: 'contractor-3',
    name: 'David Chen',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 4.7,
    location: 'East End',
    availability: ['weekdays', 'weekends'],
    verificationStatus: 'pending',
    services: [
      { id: 'service-5', name: 'Custom Furniture', description: 'Handcrafted furniture and built-in storage', category: 'Carpentry', price: 450, duration: '1-2 weeks' },
      { id: 'service-6', name: 'Door Installation', description: 'Professional door hanging and hardware installation', category: 'Carpentry', price: 180, duration: '4-6 hours' }
    ]
  },
  {
    id: 'contractor-4',
    name: 'Lisa Martinez',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    location: 'West Side',
    availability: ['weekdays'],
    verificationStatus: 'verified',
    services: [
      { id: 'service-7', name: 'Interior Painting', description: 'Professional interior painting services', category: 'Painting', price: 320, duration: '2-3 days' },
      { id: 'service-8', name: 'Exterior House Painting', description: 'Complete exterior painting and preparation', category: 'Painting', price: 1200, duration: '5-7 days' }
    ]
  },
  {
    id: 'contractor-5',
    name: 'Robert Taylor',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    rating: 4.6,
    location: 'South District',
    availability: ['weekends'],
    verificationStatus: 'not-started',
    services: [
      { id: 'service-9', name: 'HVAC Maintenance', description: 'Regular HVAC system inspection and maintenance', category: 'HVAC', price: 150, duration: '2-3 hours' },
      { id: 'service-10', name: 'AC Installation', description: 'New air conditioning system installation', category: 'HVAC', price: 2500, duration: '1-2 days' }
    ]
  }
];

export function ServiceListing({ onBookService }: ServiceListingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const categories = ['all', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'HVAC'];
  const locations = ['all', 'Downtown District', 'North Side', 'East End', 'West Side', 'South District'];

  const getVerificationBadge = (status?: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">✓ Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">⏳ Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">✗ Rejected</Badge>;
      default:
        return null;
    }
  };

  const filteredContractors = mockContractors.filter(contractor => {
    const matchesSearch = contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contractor.services.some(service => 
                           service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesCategory = selectedCategory === 'all' || 
                           contractor.services.some(service => service.category === selectedCategory);
    
    const matchesLocation = selectedLocation === 'all' || contractor.location === selectedLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Professional</h1>
          <p className="text-gray-600">Browse verified contractors and book your next service</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search services or contractors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="w-full">
              <Clock className="h-4 w-4 mr-2" />
              Available Now
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {filteredContractors.map(contractor => (
            <Card key={contractor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <ImageWithFallback
                    src={contractor.profileImage}
                    alt={contractor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-semibold text-gray-900">{contractor.name}</h3>
                        {getVerificationBadge(contractor.verificationStatus)}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{contractor.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{contractor.location}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {contractor.services.map(service => (
                    <div key={service.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{service.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        </div>
                        <Badge variant="secondary">{service.category}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{service.duration}</span>
                          </div>
                          <div className="text-lg font-semibold text-gray-900">
                            ${service.price}
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => onBookService(contractor, service)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredContractors.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-600 mb-4">No contractors found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedLocation('all');
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}