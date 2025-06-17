import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MapPin, Eye, EyeOff, CheckCircle } from 'lucide-react';
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
  const [verificationSent, setVerificationSent] = useState(false);
  
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
      setVerificationSent(true);
    } catch (error) {
      setErrors({
        ...errors,
        form: 'Error creating account. Please try again.',
      });
    }
  };
  
  if (verificationSent) {
    return (
      <Layout hideFooter>
        <Container size="sm" className="py-6 md:py-16">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
              <CardDescription className="text-center">
                We've sent a verification link to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">Please check your inbox and click the link to verify your email address.</p>
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? <button 
                  onClick={handleSubmit}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Resend verification
                </button>
              </p>
              <div className="mt-6">
                <Button onClick={() => navigate('/login')} variant="outline">
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Layout>
    );
  }
  
  return (
    <Layout hideFooter>
      <Container size="sm" className="py-6 md:py-16">
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
                  showPasswordToggle
                />
                
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  leftIcon={<Lock size={18} />}
                  showPasswordToggle
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
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};
