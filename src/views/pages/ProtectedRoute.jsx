import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute - loading:', loading, 'user:', user);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('ProtectedRoute - no user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute - user found, rendering outlet');
  return <Outlet />;
};

export default ProtectedRoute;