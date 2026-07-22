import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthRedirect, loading } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const status = searchParams.get('status');
    const errorMsg = searchParams.get('error');

    if (status === 'error' || errorMsg) {
      setError(errorMsg || 'Authentication failed');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    // Success – fetch user data
    handleOAuthRedirect()
      .then(() => navigate('/'))
      .catch(() => navigate('/login'));
  }, [searchParams, handleOAuthRedirect, navigate]);

  if (error) {
    return <div>Authentication error: {error}. Redirecting...</div>;
  }

  return <div>Completing sign‑in... Please wait.</div>;
};

export default OAuthCallback;