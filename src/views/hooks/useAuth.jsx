import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../../services/authService'; 
import User from '../../models/UserModel';   

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await AuthService.getStatus();
      if (response.data.authenticated) {
        setUser(User.fromJSON(response.data.user));
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const handleOAuthRedirect = async () => {
    await checkAuth();
  };

  const login = () => {
    AuthService.loginWithGoogle();  //redirects to Google
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth, handleOAuthRedirect }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


// import { useContext } from 'react';
// import AuthContext from '../../utils/AuthContext';
// import AuthService from '../../services/ApiSevice';
// import User from '../../models/UserModel';

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// // The actual provider logic (inside AuthContext)
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const checkAuth = async () => {
//     try {
//       const response = await AuthService.getStatus();
//       if (response.data.authenticated) {
//         setUser(User.fromJSON(response.data.user));
//       } else {
//         setUser(null);
//       }
//     } catch (error) {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     await AuthService.logout();
//     setUser(null);
//   };

//   // Called after OAuth redirect to refresh user data
//   const handleOAuthRedirect = async () => {
//     await checkAuth();
//   };

//   // Login redirects to Google
//   const login = () => {
//     AuthService.loginWithGoogle();
//   };

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout, checkAuth, handleOAuthRedirect }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };