import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MapPin } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Container } from '../../components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../lib/store';
import { UserRole } from '../../lib/types';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    form: '',
  });
  
  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      form: '',
    };
    
    if (!name) {
      newErrors.name = 'Name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    
    return (
      !newErrors.name &&
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.confirmPassword
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        ...errors,
        form: 'Error creating account. Please try again.',
      });
    }
  };
  
  return (
    <Layout hideFooter>
      <Container size="sm" className="py-12 md:py-16">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold text-neutral-900">FindMeFit</span>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Sign up to start your fitness journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  leftIcon={<User size={18} />}
                />
                
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  leftIcon={<Mail size={18} />}
                />
                
                <Input
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  leftIcon={<Lock size={18} />}
                />
                
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  leftIcon={<Lock size={18} />}
                />
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    I am a:
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg ${
                        role === 'client'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-input hover:bg-muted'
                      }`}
                      onClick={() => setRole('client')}
                    >
                      <User className="h-6 w-6 mb-2" />
                      <span className="font-medium">Client</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Looking for fitness classes
                      </span>
                    </button>
                    
                    <button
                      type="button"
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg ${
                        role === 'instructor'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-input hover:bg-muted'
                      }`}
                      onClick={() => setRole('instructor')}
                    >
                      <MapPin className="h-6 w-6 mb-2" />
                      <span className="font-medium">Instructor</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Offering fitness services
                      </span>
                    </button>
                  </div>
                </div>
                
                {errors.form && (
                  <div className="text-error-500 text-sm text-center">{errors.form}</div>
                )}
                
                <Button type="submit" fullWidth isLoading={isLoading}>
                  Create Account
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-neutral-500">Or sign up with</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full flex justify-center py-2 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-foreground hover:bg-muted"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.02 14.93h-2.34c-.24 0-.44-.17-.5-.4-.21-.85-.82-1.55-1.68-1.98.32-.09.69-.23.87-.39.28-.24.46-.65.46-1.13 0-.47-.28-.89-.77-1.1.09-.05.19-.09.28-.14.31-.18.58-.49.58-.86 0-.34-.23-.73-.7-.95.1-.21.15-.44.15-.68 0-.68-.71-1.36-1.76-1.36h-3.88c-.38 0-.69.3-.69.67V16c0 .37.31.67.69.67h4.66c.81 0 1.5-.51 1.75-1.22l.75-2.22c.2-.59-.1-1.23-.7-1.5.07-.2.11-.4.11-.61 0-.37-.21-.71-.55-.89.05-.12.08-.26.08-.39 0-.37-.27-.7-.64-.78z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="w-full flex justify-center py-2 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-foreground hover:bg-muted"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.61 6.34c1.07 0 1.93.86 1.93 1.93 0 1.07-.86 1.93-1.93 1.93-1.07 0-1.93-.86-1.93-1.93-.01-1.07.86-1.93 1.93-1.93zm-6-1.58c1.3 0 2.36 1.06 2.36 2.36 0 1.3-1.06 2.36-2.36 2.36s-2.36-1.06-2.36-2.36c0-1.31 1.05-2.36 2.36-2.36zm0 9.13v3.75c-2.4-.75-4.3-2.6-5.14-4.96 1.05-1.12 3.67-1.69 5.14-1.69.53 0 1.2.08 1.9.22-1.64.87-1.9 2.02-1.9 2.68zM12 20c-.27 0-.53-.01-.79-.04v-4.07c0-1.42 2.94-2.13 4.4-2.13 1.07 0 2.92.39 3.84 1.15-1.17 2.97-4.06 5.09-7.45 5.09z" />
                  </svg>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-sm text-neutral-500">
          By signing up, you agree to our{' '}
          <Link to="/terms" className="text-primary hover:text-primary/80">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-primary hover:text-primary/80">
            Privacy Policy
          </Link>
          .
        </div>
      </Container>
    </Layout>
  );
};