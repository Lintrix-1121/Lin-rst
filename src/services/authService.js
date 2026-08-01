import ApiService from "./ApiSevice";


const AuthService = {
  //Get current authenticated user info
  async getStatus() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      // No token → user is not authenticated
      return { data: { authenticated: false, user: null } };
    }

    try {
      const response = await ApiService.get("/auth/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response; // expects { data: { authenticated: true, user: {...} } }
    } catch (error) {
      // If the token is invalid or request fails, treat as unauthenticated
      return { data: { authenticated: false, user: null } };
    }
  },

  
  logout() {
    return ApiService.post('/auth/logout');
  },
   
  // Initiate Google OAuth
  loginWithGoogle() {


    console.log("ENV:", import.meta.env);
    console.log("API URL:", import.meta.env.VITE_API_URL);
    console.log("Redirecting to:", `${import.meta.env.VITE_API_URL}/auth/google`);
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  }
};

export default AuthService;


