import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Wrench, 
  Zap, 
  Hammer, 
  PaintBucket, 
  Car, 
  Home,
  Settings,
  HardHat,
  ArrowRight
} from 'lucide-react';
import type { Page, Contractor, Service } from '../App';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  onBookService: (contractor: Contractor, service: Service) => void;
}

const serviceCategories = [
  { name: 'Plumbing', icon: Wrench, color: 'bg-blue-100 text-blue-600' },
  { name: 'Electrical', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Carpentry', icon: Hammer, color: 'bg-amber-100 text-amber-600' },
  { name: 'Painting', icon: PaintBucket, color: 'bg-green-100 text-green-600' },
  { name: 'Auto Repair', icon: Car, color: 'bg-red-100 text-red-600' },
  { name: 'HVAC', icon: Settings, color: 'bg-purple-100 text-purple-600' },
  { name: 'Roofing', icon: Home, color: 'bg-orange-100 text-orange-600' },
  { name: 'Construction', icon: HardHat, color: 'bg-gray-100 text-gray-600' },
];

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Book Trusted HandyGo Services 
                <span className="text-amber-400"> Instantly</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Connect with skilled professionals in your area. From plumbing to carpentry, 
                find the right tradesperson for your project and track everything with digital job cards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => onNavigate('services')}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 text-lg"
                >
                  Book a Service
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('job-cards')}
                  className="border-white text-white hover:bg-white hover:text-blue-800 px-8 py-3 text-lg"
                >
                  View My Job Cards
                </Button>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Skilled tradesperson at work"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Popular Service Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our most requested services and find the perfect professional for your needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {serviceCategories.map((category) => (
              <Card 
                key={category.name}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
                onClick={() => onNavigate('services')}
              >
                <CardContent className="p-6 text-center">
                  <div className={`${category.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Verified Professionals</h3>
              <p className="text-gray-600">
                All our contractors are thoroughly vetted with verified credentials and customer reviews.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Digital Job Cards</h3>
              <p className="text-gray-600">
                Track every detail of your project with our comprehensive digital job card system.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <HardHat className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Guarantee</h3>
              <p className="text-gray-600">
                Every job comes with our satisfaction guarantee and transparent pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers who trust our platform for their home and business needs.
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate('services')}
            className="bg-amber-500 hover:bg-amber-600 text-white px-12 py-4 text-lg"
          >
            Find a Professional Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}