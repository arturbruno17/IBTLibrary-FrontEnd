import React, { useState } from 'react';
import Navbar from './Navbar';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { 
  BookOpen, 
  Home, 
  BookCopy, 
  Users, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Role } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const navItems = [
    {
      label: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      href: '/dashboard',
      roles: [Role.READER, Role.LIBRARIAN, Role.ADMIN],
    },
    {
      label: 'Catalog',
      icon: <BookOpen className="h-5 w-5" />,
      href: '/catalog',
      roles: [Role.READER, Role.LIBRARIAN, Role.ADMIN],
    },
    {
      label: 'Loans',
      icon: <BookCopy className="h-5 w-5" />,
      href: '/loans',
      roles: [Role.READER, Role.LIBRARIAN, Role.ADMIN],
    },
    {
      label: 'Users',
      icon: <Users className="h-5 w-5" />,
      href: '/users',
      roles: [Role.ADMIN],
    },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.some(role => user && hasRole(role))
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Button 
        variant="ghost" 
        className="lg:hidden fixed top-4 left-4 z-50 p-2" 
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm lg:hidden z-30"
          onClick={closeSidebar}
        />
      )}

      <div 
        className={cn(
          "glass-darker fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:static lg:w-64 lg:min-h-screen flex-shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border/50">
            <Link 
              to="/" 
              className="flex items-center space-x-2 animate-pulse-subtle"
              onClick={closeSidebar}
            >
              <img 
                src="/lovable-uploads/48887cda-ca86-4941-9254-053b934dc754.png" 
                alt="Library Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-display font-bold text-foreground">
                Library
              </span>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={closeSidebar}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-border/50 p-4">
            {user && (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </div>

                <Button 
                  variant="outline"
                  className="w-full flex items-center justify-center" 
                  onClick={() => {
                    closeSidebar();
                    logout();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} logout={logout} />
        <main className="flex-1 overflow-y-auto py-6 px-6 lg:py-8 lg:px-10 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
