import TuneModel from '../models/TuneModel';

class TuneController {
  constructor() {
    this.model = new TuneModel();
    this.loading = false;
    this.error = null;
    this.tunes = [];
    this.currentTune = null;
    this.pagination = null;
    this.searchResults = null;
  }

  //tune operations
  async loadTunes(params = {}) {
    console.log('🎵 TuneController.loadTunes called with:', params);
    this.loading = true;
    this.error = null;
    
    try {
      const tunes = await this.model.fetchAllTunes(params);
      this.loading = false;
      return tunes;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async loadTune(id) {
    this.loading = true;
    this.error = null;
    
    try {
      const tune = await this.model.fetchTuneById(id);
      this.loading = false;
      return tune;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async createTune(tuneData) {
    this.loading = true;
    this.error = null;
    
    try {
      const newTune = await this.model.createTune(tuneData);
      this.loading = false;
      return newTune;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async updateTune(id, tuneData) {
    this.loading = true;
    this.error = null;
    
    try {
      const updatedTune = await this.model.updateTune(id, tuneData);
      this.loading = false;
      return updatedTune;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async deleteTune(id) {
    this.loading = true;
    this.error = null;
    
    try {
      await this.model.deleteTune(id);
      this.loading = false;
      return true;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async deleteMultipleTunes(ids) {
    this.loading = true;
    this.error = null;
    
    try {
      await this.model.deleteMultipleTunes(ids);
      this.loading = false;
      return true;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async searchTunes(searchParams) {
    this.loading = true;
    this.error = null;
    
    try {
      const results = await this.model.searchTunes(searchParams);
      this.loading = false;
      return results;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  //playback tracking
  async recordPlay(id) {
    this.loading = true;
    this.error = null;
    
    try {
      const result = await this.model.recordPlay(id);
      this.loading = false;
      return result;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async recordSkip(id) {
    this.loading = true;
    this.error = null;
    
    try {
      const result = await this.model.recordSkip(id);
      this.loading = false;
      return result;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async updateRating(id, rating) {
    this.loading = true;
    this.error = null;
    
    try {
      const result = await this.model.updateRating(id, rating);
      this.loading = false;
      return result;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async toggleFavorite(id) {
    this.loading = true;
    this.error = null;
    
    try {
      const result = await this.model.toggleFavorite(id);
      this.loading = false;
      return result;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  //analytics and statistics
  async getPlaybackStats(id) {
    this.loading = true;
    this.error = null;
    
    try {
      const stats = await this.model.getPlaybackStats(id);
      this.loading = false;
      return stats;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async getMostPlayed(params = {}) {
    this.loading = true;
    this.error = null;
    
    try {
      const tunes = await this.model.getMostPlayed(params);
      this.loading = false;
      return tunes;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async getFavorites(params = {}) {
    this.loading = true;
    this.error = null;
    
    try {
      const favorites = await this.model.getFavorites(params);
      this.loading = false;
      return favorites;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async getRecentlyPlayed(params = {}) {
    this.loading = true;
    this.error = null;
    
    try {
      const tunes = await this.model.getRecentlyPlayed(params);
      this.loading = false;
      return tunes;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async getRecentTunes(params = {}) {
    this.loading = true;
    this.error = null;
    
    try {
      const tunes = await this.model.getRecentTunes(params);
      this.loading = false;
      return tunes;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  //statistics
  async getTotalTuneCount(params = {}) {
    this.loading = true;
    this.error = null;
    
    try {
      const countData = await this.model.fetchTotalTuneCount(params);
      this.loading = false;
      return countData;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async getTuneStatistics(params = {}) {
    this.loading = true;
    this.error = null;
    
    try {
      const stats = await this.model.fetchTuneStatistics(params);
      this.loading = false;
      return stats;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async getTotalStats() {
    this.loading = true;
    try {
      const data = await this.model.getTotalStats(); // you'll need to add this to model
      this.loading = false;
      return data;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async getTimelineData(params) {
    this.loading = true;
    try {
      const data = await this.model.getTimelineData(params);
      this.loading = false;
      return data;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  //batch operations
  async batchUpdateTunes(updates) {
    this.loading = true;
    this.error = null;
    
    try {
      const results = await this.model.batchUpdateTunes(updates);
      this.loading = false;
      return results;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  //getters
  getTunes() {
    return this.model.getTunes();
  }

  getCurrentTune() {
    return this.model.getCurrentTune();
  }

  getPagination() {
    return this.model.getPagination();
  }

  getSearchResults() {
    return this.model.getSearchResults();
  }

  getStatistics() {
    return this.model.getStatistics();
  }

  isLoading() {
    return this.loading;
  }

  getError() {
    return this.error;
  }

  clearError() {
    this.error = null;
  }

  //utility methods
  filterTunesByGenre(genre) {
    return this.model.filterTunesByGenre(genre);
  }

  filterTunesByArtist(artist) {
    return this.model.filterTunesByArtist(artist);
  }

  filterTunesByYear(year) {
    return this.model.filterTunesByYear(year);
  }

  sortTunesByField(field, order = 'asc') {
    return this.model.sortTunesByField(field, order);
  }

  //statistics helpers
  getTotalPlayCount() {
    return this.model.getTotalPlayCount();
  }

  getAverageRating() {
    return this.model.getAverageRating();
  }

  getMostPlayedTune() {
    return this.model.getMostPlayedTune();
  }

  getFavoriteTunes() {
    return this.model.getFavoriteTunes();
  }


  async getMonthlyStreams(id, params = {}) {
    this.loading = true;
    this.error = null;
    try {
      const data = await this.model.getMonthlyStreams(id, params);
      this.loading = false;
      return data;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async getOverallMonthlyStreams(params = {}) {
    this.loading = true;
    this.error = null;
    try {
      const data = await this.model.getOverallMonthlyStreams(params);
      this.loading = false;
      return data;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async getAverageStreams(params = {}) {
    this.loading = true;
    this.error = null;
    try {
      const data = await this.model.getAverageStreams(params);
      this.loading = false;
      return data;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async getRepeatRate(id, params = {}) {
    this.loading = true;
    this.error = null;
    try {
      const data = await this.model.getRepeatRate(id, params);
      this.loading = false;
      return data;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async getPlaylistAddCount(id) {
    this.loading = true;
    this.error = null;
    try {
      const data = await this.model.getPlaylistAddCount(id);
      this.loading = false;
      return data;
    } catch (error) {
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }
}

export default TuneController;



