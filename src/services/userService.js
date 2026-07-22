import ApiService from './ApiSevice';

const UserService = {
  getProfile() {
    return ApiService.get('/users/me');
  },

  updateProfile(data) {
    return ApiService.put('/users/me', data);
  },

  deleteAccount() {
    return ApiService.delete('/users/me');
  }
};

export default UserService;