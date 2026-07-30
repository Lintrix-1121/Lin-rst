import ApiService from "./ApiSevice";


const AuthService = {
  //Get current authenticated user info
  async getAuthStatus (req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          authenticated: false,
          message: "req.user missing"
        });
      }

      const dbUser = await this.User.findByPk(req.user.userId);
      console.log("DB user =", dbUser);  // full user from DB

      if (!dbUser) {
        return res.status(401).json({
          authenticated: false,
          message: "User not found",
          user: null,
        });
      }

      return res.status(200).json({
        authenticated: true,
        user: {
          userId: dbUser.userId,          // ✅ from DB
          userName: dbUser.userName,
          email: dbUser.email,
          provider: dbUser.provider,
          providerId: dbUser.providerId,
          createdAt: dbUser.createdAt,
          updatedAt: dbUser.updatedAt,
          profilePicture: dbUser.profilePicture,
          lastLoginAt: dbUser.lastLoginAt,   // ✅ correct casing
          isActive: dbUser.isActive,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        authenticated: false,
        message: "Unable to verify authentication",
      });
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


