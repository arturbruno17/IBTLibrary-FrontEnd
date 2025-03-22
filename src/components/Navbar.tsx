
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  Bell, 
  Moon, 
  Sun,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User as UserType } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  user: UserType | null;
  logout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, logout }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const isMobile = useIsMobile();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="glass-darker sticky top-0 z-20 border-b border-border/50">
      <div className="px-4 lg:px-8 flex h-16 items-center justify-between">
        {/* Left section - Brand (visible on mobile to replace sidebar) */}
        {isMobile && (
          <Link to="/" className="lg:hidden flex items-center space-x-2">
            <span className="font-display text-lg font-bold">IBT Library</span>
          </Link>
        )}

        {/* Center section - Just a spacer on mobile */}
        <div className="flex-1 lg:flex lg:justify-center">
          {!isMobile && (
            <div className="relative">
              {/* You can add a search bar here in the future */}
            </div>
          )}
        </div>

        {/* Right section - User actions */}
        <div className="flex items-center space-x-3">
          {/* Theme toggle */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Add book button (only for librarians and admins) */}
          {user && (user.role === 'librarian' || user.role === 'admin') && (
            <Button 
              variant="ghost" 
              size="icon" 
              asChild
            >
              <Link to="/add-book" aria-label="Add book">
                <PlusCircle className="h-5 w-5" />
              </Link>
            </Button>
          )}

          {/* Notifications (placeholder) */}
          <Button 
            variant="ghost" 
            size="icon"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>

          {/* User menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  aria-label="Open user menu"
                >
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link 
                    to="/profile" 
                    className="cursor-pointer flex w-full items-center"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer" 
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
