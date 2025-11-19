import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User, LogOut, Hammer, Shield, Briefcase } from 'lucide-react';
import type { Page, User as UserType } from '../App';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: UserType | null;
  onLogout: () => void;
}

export function Navigation({ currentPage, onNavigate, user, onLogout }: NavigationProps) {
  const navItems = [
    { key: 'home' as Page, label: 'Home' },
    { key: 'services' as Page, label: 'Services' },
    { key: 'jobs' as Page, label: 'Jobs', icon: Briefcase },
    { key: 'job-cards' as Page, label: 'My Job Cards' },
  ];

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

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-blue-600 p-2 rounded-lg">
              <Hammer className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              HandyGo
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  currentPage === item.key
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </button>
            ))}
            
            {user && (
              <button
                onClick={() => onNavigate('verification')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  currentPage === 'verification'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Verification</span>
              </button>
            )}
            
            {user?.role === 'contractor' && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  currentPage === 'dashboard'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </button>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{user.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                  {getVerificationBadge(user.verificationStatus)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => onNavigate('login')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Login / Signup
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}