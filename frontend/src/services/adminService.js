import api from './api';

export const adminService = {
  getAllProfiles: () => api.get('/admin/faculty-profiles'),
  getFacultySubmissions: (year, facultyName) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (facultyName) params.append('facultyName', facultyName);
    return api.get(`/admin/faculty-submissions?${params.toString()}`);
  },
  getProfileById: (id) => api.get(`/admin/faculty-profiles/${id}`),
  getCompleteFacultyData: (id) => api.get(`/admin/faculty-profiles/${id}/complete`),

  getAllTargets: () => api.get('/admin/targets'),

  getAllJournals: () => api.get('/admin/journals'),
  getAllConferences: () => api.get('/admin/conferences'),
  getAllPatents: () => api.get('/admin/patents'),
  getAllBookChapters: () => api.get('/admin/book-chapters'),
  getAllProjects: () => api.get('/admin/projects'),

  getAnalytics: () => api.get('/admin/analytics'),

  getAllBooks: () => api.get('/admin/books'),

  // Approval Workflow
  getPendingApprovals: (type) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    return api.get(`/admin/approvals/pending?${params.toString()}`);
  },
  approvePublication: (type, id) => api.post(`/admin/approvals/${type}/${id}/approve`),
  rejectPublication: (type, id, remarks) => api.post(`/admin/approvals/${type}/${id}/reject`, { remarks }),
  sendBackPublication: (type, id, remarks) => api.post(`/admin/approvals/${type}/${id}/send-back`, remarks ? { remarks } : {}),
  lockPublication: (type, id) => api.post(`/admin/approvals/${type}/${id}/lock`),

  // Reports
  generateNAACReport: (year, facultyId) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (facultyId) params.append('facultyId', facultyId);
    return api.get(`/admin/reports/naac?${params.toString()}`);
  },
  generateNBAReport: (year, facultyId) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (facultyId) params.append('facultyId', facultyId);
    return api.get(`/admin/reports/nba?${params.toString()}`);
  },
  generateNIRFReport: (year, facultyId) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (facultyId) params.append('facultyId', facultyId);
    return api.get(`/admin/reports/nirf?${params.toString()}`);
  },

  exportToExcel: (year, category, facultyName) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (category) params.append('category', category);
    if (facultyName) params.append('facultyName', facultyName);
    return api.get(`/admin/export?${params.toString()}`, {
      responseType: 'blob'
    });
  },

  exportReportToExcel: (reportType, year, facultyId) => {
    const params = new URLSearchParams();
    params.append('reportType', reportType);
    if (year) params.append('year', year);
    if (facultyId) params.append('facultyId', facultyId);
    return api.post(`/admin/reports/export/excel?${params.toString()}`, {}, {
      responseType: 'blob'
    });
  },

  exportReportToPDF: (reportType, year, facultyId) => {
    const params = new URLSearchParams();
    params.append('reportType', reportType);
    if (year) params.append('year', year);
    if (facultyId) params.append('facultyId', facultyId);
    return api.post(`/admin/reports/export/pdf?${params.toString()}`, {}, {
      responseType: 'blob'
    });
  }
};

