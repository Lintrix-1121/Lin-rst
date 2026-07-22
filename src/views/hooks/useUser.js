import { useState } from 'react';
import UserService from '../../services/userService';
import { useAuth } from './useAuth';

export const useUser = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const response = await UserService.updateProfile(data);
      setUser(response.data.user);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      await UserService.deleteAccount();
      // logout after deletion
      await logout(); //import logout
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, updateProfile, deleteAccount };
};