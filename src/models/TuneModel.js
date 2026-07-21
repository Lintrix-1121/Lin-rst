import { tuneAPI } from './api/tuneAPI'

class TuneModel {
  constructor() {
    this.tunes = [];
    this.currentTune = null;
    this.pagination = null;
    this.searchResults = null;
    this.statistics = null;
    this.totalCount = 0;
  }

  // Basic CRUD operations
  async fetchAllTunes(params = {}) {
    try {
      console.log('TuneModel.fetchAllTunes calling API with params:', params);
      const response = await tuneAPI.getAll(params);
      console.log('Full API response:', response);
      
      // Handle the correct response structure: { success: true, data: { tunes: [], pagination: {} } }
      if (response.data && response.data.success === true) {
        console.log('API response has success: true structure');
        
        const responseData = response.data.data || response.data;
        console.log('Response data:', responseData);
        
        // Extract tunes from the nested data structure
        let tunes = [];
        if (responseData.tunes && Array.isArray(responseData.tunes)) {
          tunes = responseData.tunes;
          this.pagination = responseData.pagination;
          console.log('Found tunes in data.tunes:', tunes.length, 'tunes');
        } else if (Array.isArray(responseData)) {
          tunes = responseData;
          console.log('Found tunes as direct array in data:', tunes.length, 'tunes');
        } else {
          console.warn('Unexpected data structure within success response:', responseData);
          tunes = [];
        }
        
        this.tunes = tunes;
        console.log('TuneModel successfully parsed tunes:', this.tunes.length, 'tunes');
        if (this.pagination) {
          console.log('Pagination info:', this.pagination);
        }
        return this.tunes;
        
      } else {
        console.warn('API response missing success: true flag');
        return this.getMockTunes();
      }
      
    } catch (error) {
      console.error('TuneModel API error:', error);
      return this.getMockTunes();
    }
  }

  async fetchTuneById(id) {
    try {
      const response = await tuneAPI.getById(id);
      
      if (response.data && response.data.success === true) {
        this.currentTune = response.data.data || response.data;
        return this.currentTune;
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      throw new Error(`Failed to fetch tune: ${error.message}`);
    }
  }

  async createTune(tuneData) {
    try {
      const response = await tuneAPI.create(tuneData);
      
      if (response.data && response.data.success === true) {
        const newTune = response.data.data || response.data;
        this.tunes.push(newTune);
        return newTune;
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      throw new Error(`Failed to create tune: ${error.message}`);
    }
  }

  async updateTune(id, tuneData) {
    try {
      const response = await tuneAPI.update(id, tuneData);
      
      if (response.data && response.data.success === true) {
        const updatedTune = response.data.data || response.data;
        const index = this.tunes.findIndex(tune => tune.id === id);
        if (index !== -1) {
          this.tunes[index] = updatedTune;
        }
        return updatedTune;
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      throw new Error(`Failed to update tune: ${error.message}`);
    }
  }

  async deleteTune(id) {
    try {
      const response = await tuneAPI.delete(id);
      
      if (response.data && response.data.success === true) {
        this.tunes = this.tunes.filter(tune => tune.id !== id);
        return true;
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      throw new Error(`Failed to delete tune: ${error.message}`);
    }
  }

  async deleteMultipleTunes(ids) {
    try {
      const response = await tuneAPI.deleteMultiple(ids);
      
      if (response.data && response.data.success === true) {
        this.tunes = this.tunes.filter(tune => !ids.includes(tune.id));
        return true;
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      throw new Error(`Failed to delete tunes: ${error.message}`);
    }
  }

  // Search and filtering
  async searchTunes(params) {
    try {
      const response = await tuneAPI.search(params);
      
      if (response.data && response.data.success === true) {
        const responseData = response.data.data || response.data;
        this.searchResults = responseData.tunes || responseData || [];
        this.pagination = responseData.pagination;
        return this.searchResults;
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      throw new Error(`Failed to search tunes: ${error.message}`);
    }
  }

  // Playback tracking
  async recordPlay(id) {
    try {
      const response = await tuneAPI.recordPlay(id);
      
      if (response.data && response.data.success === true) {
        return response.data.data || response.data;
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      throw new Error(`Failed to record play: ${error.message}`);
    }
  }

  async recordSkip(id) {
    try {
      const response = await tuneAPI.recordSkip(id);
      
      if (response.data && response.data.success === true) {
        return response.data.data || response.data;
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      throw new Error(`Failed to record skip: ${error.message}`);
    }
  }

  async updateRating(id, rating) {
    try {
      const response = await tuneAPI.updateRating(id, rating);
      
      if (response.data && response.data.success === true) {
        return response.data.data || response.data;
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      throw new Error(`Failed to update rating: ${error.message}`);
    }
  }

  async toggleFavorite(id) {
    try {
      const response = await tuneAPI.toggleFavorite(id);
      
      if (response.data && response.data.success === true) {
        return response.data.data || response.data;
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      throw new Error(`Failed to toggle favorite: ${error.message}`);
    }
  }

  // Analytics and statistics
  async getPlaybackStats(id) {
    try {
      const response = await tuneAPI.getPlaybackStats(id);
      
      if (response.data && response.data.success === true) {
        return response.data.data || response.data;
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      throw new Error(`Failed to fetch playback stats: ${error.message}`);
    }
  }

  async getMostPlayed(params = {}) {
    try {
      const response = await tuneAPI.getMostPlayed(params);
      
      if (response.data && response.data.success === true) {
        const responseData = response.data.data || response.data;
        return responseData.tunes || responseData || [];
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      throw new Error(`Failed to fetch most played: ${error.message}`);
    }
  }

  async getFavorites(params = {}) {
    try {
      const response = await tuneAPI.getFavorites(params);
      
      if (response.data && response.data.success === true) {
        const responseData = response.data.data || response.data;
        return responseData.tunes || responseData || [];
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      throw new Error(`Failed to fetch favorites: ${error.message}`);
    }
  }

  async getRecentlyPlayed(params = {}) {
    try {
      const response = await tuneAPI.getRecentlyPlayed(params);
      
      if (response.data && response.data.success === true) {
        const responseData = response.data.data || response.data;
        return responseData.tunes || responseData || [];
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      throw new Error(`Failed to fetch recently played: ${error.message}`);
    }
  }

  async getRecentTunes(params = {}) {
    try {
      const response = await tuneAPI.getRecent(params);
      
      if (response.data && response.data.success === true) {
        const responseData = response.data.data || response.data;
        return responseData.tunes || responseData || [];
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      throw new Error(`Failed to fetch recent tunes: ${error.message}`);
    }
  }

  // Statistics
  async fetchTotalTuneCount(params = {}) {
    try {
      const response = await tuneAPI.getTotalCount(params);
      
      if (response.data && response.data.success === true) {
        const data = response.data.data || response.data;
        this.totalCount = data.total_count || data.count || 0;
        return data;
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      console.error('Error fetching total tune count:', error);
      return {
        total_count: this.tunes.length,
        statistics: {
          total_tunes: this.tunes.length,
          total_storage_bytes: this.tunes.reduce((acc, tune) => acc + (tune.file_size || 0), 0)
        }
      };
    }
  }

  async fetchTuneStatistics(params = {}) {
    try {
      const response = await tuneAPI.getStatistics(params);
      
      if (response.data && response.data.success === true) {
        const data = response.data.data || response.data;
        this.statistics = data;
        return this.statistics;
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      console.error('Error fetching tune statistics:', error);
      const totalStorage = this.tunes.reduce((acc, tune) => acc + (tune.file_size || 0), 0);
      const totalDuration = this.tunes.reduce((acc, tune) => acc + (tune.duration || 0), 0);
      const favoriteTunes = this.tunes.filter(tune => tune.favorite).length;
      
      return {
        total_count: this.tunes.length,
        statistics: {
          total_tunes: this.tunes.length,
          total_storage_bytes: totalStorage,
          total_storage_gb: (totalStorage / (1024 * 1024 * 1024)).toFixed(2),
          average_duration: (totalDuration / this.tunes.length || 0).toFixed(2),
          favorite_tunes: favoriteTunes,
          total_plays: this.tunes.reduce((acc, tune) => acc + (tune.play_count || 0), 0),
          average_rating: (this.tunes.reduce((acc, tune) => acc + (tune.rating || 0), 0) / this.tunes.length || 0).toFixed(1)
        },
        format_breakdown: this.getFormatBreakdown()
      };
    }
  }

  async batchUpdateTunes(updates) {
    try {
      const response = await tuneAPI.batchUpdate(updates);
      
      if (response.data && response.data.success === true) {
        return response.data.data || response.data;
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      throw new Error(`Failed to batch update tunes: ${error.message}`);
    }
  }

  // File operations
  async downloadTune(id) {
    try {
      const response = await tuneAPI.download(id);
      return response.data || response;
    } catch (error) {
      throw new Error(`Failed to download tune: ${error.message}`);
    }
  }

  async streamTune(id) {
    try {
      const response = await tuneAPI.stream(id);
      return response.data || response;
    } catch (error) {
      throw new Error(`Failed to stream tune: ${error.message}`);
    }
  }

  // Helper methods
  getFormatBreakdown() {
    const formatMap = {};
    this.tunes.forEach(tune => {
      const format = tune.file_format || 'unknown';
      if (!formatMap[format]) {
        formatMap[format] = {
          format: format,
          count: 0,
          total_size: 0
        };
      }
      formatMap[format].count++;
      formatMap[format].total_size += tune.file_size || 0;
    });
    
    return Object.values(formatMap).map(item => ({
      ...item,
      total_size_gb: (item.total_size / (1024 * 1024 * 1024)).toFixed(3)
    }));
  }

  // Getters
  getTunes() {
    return this.tunes;
  }

  getCurrentTune() {
    return this.currentTune;
  }

  getPagination() {
    return this.pagination;
  }

  getSearchResults() {
    return this.searchResults;
  }

  getStatistics() {
    return this.statistics;
  }

  // Local filtering and sorting
  filterTunesByGenre(genre) {
    return this.tunes.filter(tune => 
      tune.genre && tune.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  filterTunesByArtist(artist) {
    return this.tunes.filter(tune => 
      tune.artist && tune.artist.toLowerCase().includes(artist.toLowerCase())
    );
  }

  filterTunesByYear(year) {
    return this.tunes.filter(tune => tune.year === parseInt(year));
  }

  sortTunesByField(field, order = 'asc') {
    return [...this.tunes].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];
      
      if (order === 'desc') {
        [aVal, bVal] = [bVal, aVal];
      }
      
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
      return 0;
    });
  }

  // Statistics helpers
  getTotalPlayCount() {
    return this.tunes.reduce((total, tune) => total + (tune.play_count || 0), 0);
  }

  getAverageRating() {
    const ratedTunes = this.tunes.filter(tune => tune.rating != null);
    if (ratedTunes.length === 0) return 0;
    const totalRating = ratedTunes.reduce((total, tune) => total + tune.rating, 0);
    return totalRating / ratedTunes.length;
  }

  getMostPlayedTune() {
    if (this.tunes.length === 0) return null;
    return this.tunes.reduce((mostPlayed, tune) => 
      (tune.play_count || 0) > (mostPlayed.play_count || 0) ? tune : mostPlayed
    );
  }

  getFavoriteTunes() {
    return this.tunes.filter(tune => tune.favorite);
  }

  // Mock data for development
  getMockTunes() {
    return [
      {
        id: 1,
        title: 'Summer Vibes',
        artist: 'DJ Cool',
        album: 'Summer Hits 2024',
        file_size: 5242880,
        duration: 218,
        file_format: 'mp3',
        genre: 'Electronic',
        year: 2024,
        play_count: 4521,
        skip_count: 120,
        rating: 4.5,
        favorite: true,
        last_played: '2024-01-15T10:30:00Z',
        created_at: '2024-01-10T08:00:00Z'
      },
      {
        id: 2,
        title: 'Midnight Drive',
        artist: 'Electro Flow',
        album: 'Night Moves',
        file_size: 7340032,
        duration: 285,
        file_format: 'mp3',
        genre: 'Electronic',
        year: 2024,
        play_count: 3890,
        skip_count: 89,
        rating: 4.2,
        favorite: false,
        last_played: '2024-01-14T15:45:00Z',
        created_at: '2024-01-09T14:30:00Z'
      },
      {
        id: 3,
        title: 'Ocean Waves',
        artist: 'Nature Sounds',
        album: 'Relaxation',
        file_size: 10485760,
        duration: 360,
        file_format: 'wav',
        genre: 'Ambient',
        year: 2024,
        play_count: 3215,
        skip_count: 45,
        rating: 4.8,
        favorite: true,
        last_played: '2024-01-13T08:20:00Z',
        created_at: '2024-01-08T11:15:00Z'
      }
    ];
  }
}

export default TuneModel;

