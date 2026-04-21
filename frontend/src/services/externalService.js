import api from './api';

const externalService = {
  searchAuthors: async (name) => {
    const response = await api.get(`/external/semantic-scholar/search?name=${name}`);
    return response.data;
  },

  getAuthorPapers: async (authorId) => {
    const response = await api.get(`/external/semantic-scholar/author/${authorId}/papers`);
    return response.data;
  },

  getOrcidWorks: async (orcidId) => {
    const response = await api.get(`/external/orcid/${orcidId}/works`);
    return response.data;
  },

  searchOrcid: (name) => api.get(`/external/orcid/search?name=${name}`).then(res => res.data),

  syncProfile: async (authorInfo) => {
    const response = await api.post('/external/sync-profile', authorInfo);
    return response.data;
  },

  syncPapers: async () => {
    const response = await api.post('/external/sync-papers');
    return response.data;
  },

  importResearchPapers: async (papers) => {
    const response = await api.post('/external/import-papers', papers);
    return response.data;
  },

  searchGoogleScholar: (name) => api.get(`/external/google-scholar/search?name=${name}`).then(res => res.data),
  getGoogleScholarPapers: (authorId) => api.get(`/external/google-scholar/author/${authorId}/papers`).then(res => res.data),

  // MongoDB Research Search (Unified)
  searchResearchPapers: (query) => api.get(`/research/search/papers?query=${query}`).then(res => res.data),
  searchResearchBooks: (query) => api.get(`/research/search/books?query=${query}`).then(res => res.data),
  searchResearchPatents: (query) => api.get(`/research/search/patents?query=${query}`).then(res => res.data),
  searchResearchAuthors: (name) => api.get(`/research/search/authors?name=${name}`).then(res => res.data)
};

export default externalService;
