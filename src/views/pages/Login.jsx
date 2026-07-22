import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { login, loading } = useAuth();

  return (
    <div className="login-container">
      <h1>Welcome</h1>
      <button onClick={login} disabled={loading}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;