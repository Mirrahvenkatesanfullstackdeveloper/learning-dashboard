import api from './api';

class AuthService {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response;
  }

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response;
  }

  async logout() {
    localStorage.removeItem('token');
    return Promise.resolve();
  }

  async getCurrentUser() {
    return api.get('/auth/me');
  }

  async forgotPassword(email) {
    return api.post('/auth/forgot-password', { email });
  }

  async resetPassword(token, password) {
    return api.post('/auth/reset-password', { token, password });
  }

  async verifyEmail(token) {
    return api.get(`/auth/verify-email/${token}`);
  }
}

export default new AuthService();