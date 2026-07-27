import ApiService from '../../services/ApiSevice'

const API_BASE = import.meta.env.VITE_API_URL;
const getToken = () => localStorage.getItem('authToken') || '';

export const tuneAPI = {
  getAll: (params = {}) => ApiService.get(`${API_BASE}/tune/`, { params }),
  getTotalCount: (params = {}) => ApiService.get(`${API_BASE}/tune/stats/count`, { params }),
  getStatistics: (params = {}) => ApiService.get(`${API_BASE}/tune/stats`, { params }),
  getById: (id) => ApiService.get(`${API_BASE}/tunes/${id}`), // check if route is /tune/:id or /tunes/:id
  getRecent: (params = {}) => ApiService.get(`${API_BASE}/tunes/recent`, { params }),
  create: (data) => ApiService.post(`${API_BASE}/tunes`, data),
  update: (id, data) => ApiService.put(`${API_BASE}/tune/${id}`, data),
  delete: (id) => ApiService.delete(`${API_BASE}/tune/${id}`),
  deleteMultiple: (ids) => ApiService.delete(`${API_BASE}/tunes`, { data: { ids } }),
  
  //search and filtering
  search: (params) => ApiService.get(`${API_BASE}/tune/search`, { params }),
  
  //playback tracking
  recordPlay: (id) => ApiService.post(`${API_BASE}/tune/${id}/play`),
  recordSkip: (id) => ApiService.post(`${API_BASE}/tune/${id}/skip`),
  updateRating: (id, rating) => ApiService.put(`${API_BASE}/tunes/${id}/rating`, { rating }),
  toggleFavorite: (id) => ApiService.put(`${API_BASE}/tune/${id}/favorite`),
  
  //analytics and statistics
  getPlaybackStats: (id) => ApiService.get(`${API_BASE}/tune/${id}/stats`),
  getMostPlayed: (params = {}) => ApiService.get(`${API_BASE}/tune/most-played`, { params }),
  getFavorites: (params = {}) => ApiService.get(`${API_BASE}/tune/favorites`, { params }),
  getRecentlyPlayed: (params = {}) => ApiService.get(`${API_BASE}/tune/recently-played`, { params }),
  
  // --- New Analytics Endpoints ---
  getMonthlyStreams: (id, params = {}) => ApiService.get(`${API_BASE}/tune/${id}/streams/monthly`, { params }),
  getOverallMonthlyStreams: (params = {}) => ApiService.get(`${API_BASE}/tune/stats/monthly`, { params }),
  getAverageStreams: (params = {}) => ApiService.get(`${API_BASE}/tune/stats/averages`, { params }),
  getRepeatRate: (id, params = {}) => ApiService.get(`${API_BASE}/tune/${id}/repeat-rate`, { params }),
  getPlaylistAddCount: (id) => ApiService.get(`${API_BASE}/tune/${id}/playlist-adds`),

  //File operations
  downloadBlob: (id) => 
    ApiService.get(`${API_BASE}/dold/download/${id}`, { responseType: 'blob', _skipAuthRedirect: true }),
  streamBlob: (id) => ApiService.get(`${API_BASE}/dold/stream/${id}`, { responseType: 'blob' }),

  getStreamUrl: (id) => {
    const token = getToken();
    return `${API_BASE}/dold/stream/${id}${token ? `?token=${token}` : ''}`;
  },
  getDownloadUrl: (id) => {
    const token = getToken();
    return `${API_BASE}/dold/download/${id}${token ? `?token=${token}` : ''}`;
  },

  getOverallMonthlyStreams: (params) => 
    ApiService.get(`${API_BASE}/tune/stats/monthly`, { params }),
  
  getAverageStreams: (params) => 
    ApiService.get(`${API_BASE}/tune/stats/averages`, { params }),
  
  getRepeatRate: (id, params) => 
    ApiService.get(`${API_BASE}/tune/${id}/repeat-rate`, { params }),
  
  getPlaylistAddCount: (id) => 
    ApiService.get(`${API_BASE}/tune/${id}/playlist-adds`),
  
  getMonthlyStreams: (id, params) => 
    ApiService.get(`${API_BASE}/tune/${id}/streams/monthly`, { params }),
  
  getTotalStats: () => ApiService.get(`${API_BASE}/tune/stats/totals`),
  
  getTimelineData: (params) => ApiService.get(`${API_BASE}/tune/stats/timeline`, { params }),
  
  //Batch operations
  batchUpdate: (updates) => ApiService.patch(`${API_BASE}/tune/batch`, updates)

  
};