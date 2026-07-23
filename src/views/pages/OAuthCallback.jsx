import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthRedirect, user, loading } = useAuth();
  const [error, setError] = useState(null);
  const [redirected, setRedirected] = useState(false);

  // On mount, check the URL params and trigger the auth check
  useEffect(() => {
    const status = searchParams.get('status');
    const errorMsg = searchParams.get('error');

    if (status === 'error' || errorMsg) {
      setError(errorMsg || 'Authentication failed');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    // Only call handleOAuthRedirect once
    if (!redirected) {
      console.log('OAuthCallback - calling handleOAuthRedirect...');
      setRedirected(true);
      handleOAuthRedirect().catch((err) => {
        console.error('OAuthCallback - error:', err);
        navigate('/login');
      });
    }
  }, [searchParams, handleOAuthRedirect, navigate, redirected]);

  //React to user changes – navigate when user is set
  useEffect(() => {
    if (user) {
      console.log('OAuthCallback - user detected, navigating to /');
      navigate('/');
    }
  }, [user, navigate]);

  if (error) {
    return <div>Authentication error: {error}. Redirecting...</div>;
  }

  return <div>Completing sign‑in... Please wait.</div>;
};

export default OAuthCallback;

