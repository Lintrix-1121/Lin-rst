import ApiService from './ApiSevice';

const AuthService = {
  //Get current authenticated user info
  getStatus() {
    return ApiService.get('/auth/status');
  },

  logout() {
    return ApiService.post('/auth/logout');
  },

  // Initiate Google OAuth
  loginWithGoogle() {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  }
};

export default AuthService;