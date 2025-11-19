import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
  className?: string;
}

export function StarRating({ rating, onChange, className }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className={cn('flex items-center', className)}>
      {[1, 2, 3, 4, 5].map((index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          className="p-0 w-8 h-8"
          onMouseEnter={() => setHoverRating(index)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onChange(index)}
        >
          <Star
            className={cn('w-6 h-6', {
              'fill-primary text-primary': index <= (hoverRating || rating),
              'fill-none text-muted-foreground': index > (hoverRating || rating),
            })}
          />
          <span className="sr-only">Rate {index} stars</span>
        </Button>
      ))}
    </div>
  );
}