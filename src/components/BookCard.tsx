import React from "react";
import { Book } from "@/types";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  book: Book;
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({ book, className }) => {
  const isAvailable = book.available;

  return (
    <div
    className={cn(
      "book-card overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
  >
    <Link to={`/books/${book.id}`} className="block h-full">
      <div className="flex flex-col justify-between h-full p-4">
        <div>
          <h3 className="font-medium leading-tight line-clamp-2">{book.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{book.author}</p>
        </div>

        <div className="mt-auto pt-4 text-xs text-muted-foreground flex items-center justify-between">
          <Badge
            className={cn(
              isAvailable ? "bg-green-500" : "bg-destructive"
            )}
          >
            {isAvailable ? 'Disponível' : 'Indisponível'}
          </Badge>
          <span className="text-xs">ISBN: {book.isbn}</span>
        </div>
      </div>
    </Link>
  </div>

  );
};

export default BookCard;
