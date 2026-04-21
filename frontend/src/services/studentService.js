import api from './api';

export const studentService = {
  // Profile
  getProfile: async () => {
    const response = await api.get('/student/profile');
    return response;
  },
  
  // Journals
  submitJournal: async (journalData) => {
    const response = await api.post('/student/journals', journalData);
    return response;
  },
  
  getMyJournals: async () => {
    const response = await api.get('/student/journals');
    return response;
  },
  
  getJournalStatus: async (journalId) => {
    const response = await api.get(`/student/journals/${journalId}/status`);
    return response;
  },
  
  // Conferences
  submitConference: async (conferenceData) => {
    const response = await api.post('/student/conferences', conferenceData);
    return response;
  },
  
  getMyConferences: async () => {
    const response = await api.get('/student/conferences');
    return response;
  },
  
  getConferenceStatus: async (conferenceId) => {
    const response = await api.get(`/student/conferences/${conferenceId}/status`);
    return response;
  },
  
  // File Upload
  uploadFile: async (category, publicationId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/student/upload/${category}/${publicationId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
  },
  
  // Generic file upload
  uploadFileGeneric: async (file, userType, userId, category) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userType', userType);
    formData.append('userId', userId);
    formData.append('category', category);
    const response = await api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
  }
};
