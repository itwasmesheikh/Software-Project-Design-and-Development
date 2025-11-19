import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center p-4 min-h-[100px]',
        className
      )}
      {...props}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}