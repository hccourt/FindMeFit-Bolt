import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Container } from '../../components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

export const EmailConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        console.log('Starting email confirmation process...');
        console.log('URL params:', Object.fromEntries(searchParams.entries()));
        
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');

        // Handle different types of confirmation URLs
        if (token_hash && type === 'email') {
          console.log('Using token_hash method for confirmation');
          // New format with token_hash
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'email'
          });

          if (error) {
            console.error('Token hash verification error:', error);
            setStatus('error');
            setMessage('Failed to confirm email. The link may have expired. Please try signing up again.');
            return;
          }

          if (data.user) {
            console.log('Email confirmed successfully with token_hash');
            setStatus('success');
            setMessage('Your email has been confirmed successfully! You can now sign in to your account.');
          }
        } else if (access_token && refresh_token) {
          console.log('Using access/refresh token method for confirmation');
          // Legacy format with access/refresh tokens
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token
          });

          if (error) {
            console.error('Session verification error:', error);
            setStatus('error');
            setMessage('Failed to confirm email. The link may have expired. Please try signing up again.');
            return;
          }

          if (data.user) {
            console.log('Email confirmed successfully with session tokens');
            setStatus('success');
            setMessage('Your email has been confirmed successfully! You can now sign in to your account.');
          }
        } else {
          console.error('No valid confirmation parameters found');
          setStatus('error');
          setMessage('Invalid confirmation link. Please try signing up again.');
          return;
        }
      } catch (error) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    confirmEmail();
  }, [searchParams]);

  return (
    <Layout hideFooter>
      <Container size="sm" className="py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Email Confirmation</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {status === 'loading' && (
              <div className="py-8">
                <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Confirming your email address...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success-500" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Email Confirmed!</h3>
                <p className="text-muted-foreground mb-6">{message}</p>
                <Button onClick={() => navigate('/login')} className="w-full">
                  Sign In to Your Account
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="py-8">
                <XCircle className="h-12 w-12 mx-auto mb-4 text-error-500" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Confirmation Failed</h3>
                <p className="text-muted-foreground mb-6">{message}</p>
                <div className="space-y-3">
                  <Button onClick={() => navigate('/signup')} className="w-full">
                    Sign Up Again
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/login')} className="w-full">
                    Try Signing In
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};