import api from './api';

export const authService = {
  login: async (email, password, registerNumber = null) => {
    const loginData = registerNumber 
      ? { registerNumber, password }
      : { email, password };
    
    const response = await api.post('/auth/login', loginData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        email: response.data.email,
        registerNumber: response.data.registerNumber,
        role: response.data.role,
        facultyId: response.data.facultyId,
        studentId: response.data.studentId
      }));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

