import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { login, loading } = useAuth();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to Crestune</h1>
      <p> Sign in to continue</p>
      <button onClick={login} disabled={loading} className='btn btn-primary'>
        {loading ? 'Loading ...' : 'Sign in with Google'}
        
      </button>
    </div>
  );
};

export default Login;