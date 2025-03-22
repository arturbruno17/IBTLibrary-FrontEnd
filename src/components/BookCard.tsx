
import React from 'react';
import { Book } from '@/types';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface BookCardProps {
  book: Book;
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({ book, className }) => {
  const isAvailable = book.availableQuantity > 0;
  
  return (
    <div 
      className={cn(
        "book-card overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
    >
      <Link to={`/books/${book.id}`} className="block">
        <div className="aspect-[2/3] relative overflow-hidden">
          {book.cover ? (
            <img 
              src={book.cover} 
              alt={book.title} 
              className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground p-4 text-center font-display">
              {book.title}
            </div>
          )}
          
          {/* Availability Badge */}
          <Badge 
            className={cn(
              "absolute top-2 right-2",
              isAvailable ? "bg-green-500" : "bg-destructive"
            )}
          >
            {isAvailable ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium leading-tight line-clamp-2">{book.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{book.author}</p>
          
          <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
            <span>{book.publishedYear || 'Unknown year'}</span>
            <span>ISBN: {book.isbn}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;
