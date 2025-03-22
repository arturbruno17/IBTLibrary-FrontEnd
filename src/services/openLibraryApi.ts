
import axios from 'axios';
import { OpenLibraryResponse, OpenLibraryBook } from '@/types';

const openLibraryApi = axios.create({
  baseURL: 'https://openlibrary.org',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Search books by ISBN
export const searchByISBN = async (isbn: string): Promise<OpenLibraryBook | null> => {
  try {
    // First try to get the book by ISBN
    const response = await openLibraryApi.get<OpenLibraryResponse>(`/search.json?isbn=${isbn}`);
    
    if (response.data.numFound > 0) {
      return response.data.docs[0];
    }
    
    // If not found by ISBN, try searching by keyword
    const fallbackResponse = await openLibraryApi.get<OpenLibraryResponse>(`/search.json?q=${isbn}`);
    
    if (fallbackResponse.data.numFound > 0) {
      return fallbackResponse.data.docs[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error searching OpenLibrary API:', error);
    return null;
  }
};

// Get book cover image URL
export const getCoverImageUrl = (coverId?: number, size: 'S' | 'M' | 'L' = 'M'): string => {
  if (!coverId) return '/placeholder.svg';
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};

// Parse OpenLibrary book to our format
export const parseOpenLibraryBook = (book: OpenLibraryBook) => {
  return {
    title: book.title,
    author: book.authors?.map(author => author.name).join(', ') || 'Unknown',
    isbn: book.isbn?.[0] || '',
    publisher: book.publishers?.[0] || '',
    publishedYear: book.publish_date ? parseInt(book.publish_date.slice(-4)) : undefined,
    description: book.description || '',
    cover: book.cover_i ? getCoverImageUrl(book.cover_i) : undefined,
    quantity: 1,
    availableQuantity: 1
  };
};

export default {
  searchByISBN,
  getCoverImageUrl,
  parseOpenLibraryBook
};
