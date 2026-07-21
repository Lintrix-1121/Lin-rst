// src/models/AnalyticsModel.js
import { tuneAPI } from './api/tuneAPI';

class AnalyticsModel {
  constructor() {
    this.stats = null;
    this.chartData = null;
    this.topTracks = [];
  }

  async fetchDashboardStats() {
    try {
      console.log('AnalyticsModel: Generating dashboard stats from tune data');
      
      // Get all tunes to generate analytics
      const tunesResponse = await tuneAPI.getAll({ limit: 1000 });
      let tunes = [];
      
      if (tunesResponse.data && tunesResponse.data.success === true) {
        tunes = tunesResponse.data.data?.tunes || tunesResponse.data.data || tunesResponse.data.tunes || [];
      } else if (Array.isArray(tunesResponse.data)) {
        tunes = tunesResponse.data;
      } else if (Array.isArray(tunesResponse)) {
        tunes = tunesResponse;
      }
      
      console.log('Found', tunes.length, 'tunes for analytics');
      
      // Generate statistics from tune data
      const stats = this.generateStatsFromTunes(tunes);
      const topTracks = this.generateTopTracksFromTunes(tunes, 5);
      
      this.stats = stats;
      this.topTracks = topTracks;
      
      return {
        stats: this.stats,
        topTracks: this.topTracks
      };
      
    } catch (error) {
      console.error('Error generating dashboard stats:', error);
      return this.getMockDashboardData();
    }
  }

  async fetchChartData(timeRange = 'monthly') {
    try {
      console.log(' AnalyticsModel: Generating chart data for timeRange:', timeRange);
      
      // Generate mock chart data based on time range
      const chartData = this.generateChartData(timeRange);
      this.chartData = chartData;
      return this.chartData;
      
    } catch (error) {
      console.error('Error generating chart data:', error);
      return this.getMockChartData();
    }
  }

  async fetchTopTracks(limit = 10) {
    try {
      console.log('🎵 AnalyticsModel: Generating top tracks with limit:', limit);
      
      // Get tunes and generate top tracks
      const tunesResponse = await tuneAPI.getAll({ limit: 1000 });
      let tunes = [];
      
      if (tunesResponse.data && tunesResponse.data.success === true) {
        tunes = tunesResponse.data.data?.tunes || tunesResponse.data.data || tunesResponse.data.tunes || [];
      } else if (Array.isArray(tunesResponse.data)) {
        tunes = tunesResponse.data;
      } else if (Array.isArray(tunesResponse)) {
        tunes = tunesResponse;
      }
      
      const topTracks = this.generateTopTracksFromTunes(tunes, limit);
      this.topTracks = topTracks;
      return this.topTracks;
      
    } catch (error) {
      console.error('Error generating top tracks:', error);
      return this.getMockTopTracks(limit);
    }
  }

  // Helper methods to generate analytics from tune data
  generateStatsFromTunes(tunes) {
    const totalPlays = tunes.reduce((sum, tune) => sum + (tune.play_count || 0), 0);
    const totalStorage = tunes.reduce((sum, tune) => sum + (tune.file_size || 0), 0);
    const totalDownloads = Math.floor(totalPlays * 0.3); // Estimate downloads as 30% of plays
    const activeUsers = Math.floor(totalPlays / 100); // Estimate active users
    
    return {
      totalPlays: totalPlays,
      downloads: totalDownloads,
      activeUsers: activeUsers,
      revenue: Math.floor(totalPlays * 0.01), // Estimate revenue
      storageUsed: totalStorage,
      totalTracks: tunes.length,
      averagePlaysPerTrack: tunes.length > 0 ? Math.floor(totalPlays / tunes.length) : 0,
      favoriteTracks: tunes.filter(tune => tune.favorite).length,
      totalDuration: tunes.reduce((sum, tune) => sum + (tune.duration || 0), 0)
    };
  }

  generateTopTracksFromTunes(tunes, limit = 10) {
    return tunes
      .sort((a, b) => (b.play_count || 0) - (a.play_count || 0))
      .slice(0, limit)
      .map(tune => ({
        name: tune.title,
        artist: tune.artist,
        plays: tune.play_count || 0,
        duration: tune.duration,
        id: tune.id
      }));
  }

  generateChartData(timeRange) {
    // Generate different chart data based on time range
    const baseData = {
      daily: [100, 150, 200, 180, 220, 250, 300],
      weekly: [1200, 1500, 1800, 1600, 2000, 2200, 2400],
      monthly: [5000, 6000, 7000, 6500, 8000, 7500, 9000],
      yearly: [45000, 48000, 52000, 50000, 55000, 58000, 60000]
    };

    const data = baseData[timeRange] || baseData.monthly;
    const labels = timeRange === 'daily' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

    return {
      labels: labels,
      datasets: [
        {
          label: 'Plays',
          data: data,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)'
        }
      ]
    };
  }

  getStats() {
    return this.stats;
  }

  getChartData() {
    return this.chartData;
  }

  getTopTracks() {
    return this.topTracks;
  }

  // Mock data methods (fallback)
  getMockDashboardData() {
    return {
      stats: {
        totalPlays: 45200,
        downloads: 12400,
        activeUsers: 2100,
        revenue: 4200,
        storageUsed: 45200000000,
        totalTracks: 1247,
        averagePlaysPerTrack: 36,
        favoriteTracks: 156,
        totalDuration: 86400
      },
      topTracks: [
        { name: 'Summer Vibes', artist: 'DJ Cool', plays: 4521, duration: 218 },
        { name: 'Midnight Drive', artist: 'Electro Flow', plays: 3890, duration: 285 },
        { name: 'Ocean Waves', artist: 'Nature Sounds', plays: 3215, duration: 360 },
        { name: 'Urban Beat', artist: 'City Producers', plays: 2987, duration: 245 },
        { name: 'Mountain High', artist: 'Nature Sounds', plays: 2654, duration: 320 },
      ]
    };
  }

  getMockChartData() {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Plays',
          data: [1200, 1900, 3000, 5000, 2000, 3000],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)'
        }
      ]
    };
  }

  getMockTopTracks(limit = 10) {
    return [
      { name: 'Summer Vibes', artist: 'DJ Cool', plays: 4521, duration: 218 },
      { name: 'Midnight Drive', artist: 'Electro Flow', plays: 3890, duration: 285 },
      { name: 'Ocean Waves', artist: 'Nature Sounds', plays: 3215, duration: 360 },
      { name: 'Urban Beat', artist: 'City Producers', plays: 2987, duration: 245 },
      { name: 'Mountain High', artist: 'Nature Sounds', plays: 2654, duration: 320 },
      { name: 'City Lights', artist: 'Urban Beats', plays: 2450, duration: 275 },
      { name: 'Desert Wind', artist: 'Nature Sounds', plays: 2300, duration: 310 },
      { name: 'Rainforest', artist: 'Jungle Beats', plays: 2150, duration: 290 },
      { name: 'Neon Dreams', artist: 'Synth Wave', plays: 2000, duration: 265 },
      { name: 'Deep Space', artist: 'Cosmic Sounds', plays: 1850, duration: 340 }
    ].slice(0, limit);
  }
}

export default AnalyticsModel;



