import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const DEMO_SERVICES = [
  {
    id: 1,
    title: 'Plumbing Service',
    description: 'Professional plumbing services for your home',
    price: '$50/hour',
    category: 'Plumbing',
  },
  {
    id: 2,
    title: 'Electrical Repairs',
    description: 'Expert electrical repair and installation',
    price: '$60/hour',
    category: 'Electrical',
  },
  {
    id: 3,
    title: 'Carpentry Work',
    description: 'Custom carpentry and furniture repairs',
    price: '$55/hour',
    category: 'Carpentry',
  },
  // Add more demo services as needed
];

export default function ServiceListing() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredServices = DEMO_SERVICES.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-4xl font-bold">Available Services</h1>
          <p className="text-muted-foreground">Find the right service for your needs</p>
        </div>
        <div className="w-full md:w-64">
          <Input
            type="search"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{service.price}</span>
                <Button onClick={() => navigate(`/book/${service.id}`)}>
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}