
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookX, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background animate-fade-in">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <BookX className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-3">404</h1>
        <h2 className="text-2xl font-medium mb-3">Page Not Found</h2>
        
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Link>
          </Button>
          
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
