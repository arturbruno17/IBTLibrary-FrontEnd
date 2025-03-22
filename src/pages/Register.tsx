
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [asLibrarian, setAsLibrarian] = useState(false);
  
  const { register, registerLibrarian, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    // Show auth error if present
    if (error) {
      setRegisterError(error);
    }
  }, [error]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      setRegisterError('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (asLibrarian) {
        await registerLibrarian(name, email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setRegisterError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left side - Logo and Brand */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 bg-gradient-to-br from-accent to-accent/20">
        <div className="text-center lg:text-left max-w-lg animate-fade-in">
          <div className="mb-6 flex justify-center lg:justify-start">
            <BookOpen className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Join IBT Library</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Create an account to start borrowing books and exploring our collection.
          </p>
          <div className="hidden lg:block">
            <h2 className="text-xl font-medium mb-3">Why Create an Account?</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Track your reading history and borrowed books</li>
              <li>Get personalized book recommendations</li>
              <li>Receive notifications about due dates</li>
              <li>Request new books for the collection</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md animate-slide-in-up">
          <CardHeader>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Enter your information to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {registerError && (
                <div className="p-3 rounded-md text-sm bg-destructive/10 text-destructive">
                  {registerError}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="librarian" 
                  checked={asLibrarian}
                  onCheckedChange={(checked) => setAsLibrarian(checked === true)}
                />
                <label
                  htmlFor="librarian"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Register as Librarian (Demo Only)
                </label>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
              
              <p className="text-xs text-muted-foreground mt-2">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
