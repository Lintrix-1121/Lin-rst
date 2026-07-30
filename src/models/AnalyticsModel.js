
import { tuneAPI } from './api/tuneAPI'; 

class AnalyticsModel {
  constructor() {
    this.stats = null;
    this.chartData = null;
    this.topTracks = [];
  }

  
  async fetchDashboardStats() {
    try {
      console.log('📊 Fetching dashboard stats from backend...');

      // Fetch all tunes (adjust limit if needed)
      const allTunesResponse = await tuneAPI.getAll({ limit: 1000 });
      const allTunes = allTunesResponse?.data?.data?.tunes || allTunesResponse?.data?.tunes || [];

      // Fetch top 5 most played tunes
      const topTracksData = await tuneAPI.getMostPlayed({ limit: 5 });
      const topTracks = topTracksData?.data?.data?.tunes || topTracksData?.data?.tunes || [];

      let totalPlays = 0;
      let totalDownloads = 0;
      let totalStorage = 0;
      let totalDuration = 0;
      let favoriteTracks = 0;
      const genreMap = {};
      const formatMap = {};

      allTunes.forEach(tune => {
        totalPlays += tune.play_count || 0;
        totalDownloads += tune.download_count || 0; // if not available, keep 0
        totalStorage += tune.file_size || 0;
        totalDuration += tune.duration || 0;
        if (tune.favorite) favoriteTracks++;

        const genre = tune.genre || 'Unknown';
        genreMap[genre] = (genreMap[genre] || 0) + 1;
        const format = tune.file_format || 'Unknown';
        formatMap[format] = (formatMap[format] || 0) + 1;
      });

      const totalTracks = allTunes.length;
      const averagePlaysPerTrack = totalTracks > 0 ? Math.round(totalPlays / totalTracks) : 0;

      // Build stats object with names matching the component
      this.stats = {
        totalPlays,
        downloads: totalDownloads,
        totalTracks,
        favoriteTracks,
        storageUsed: totalStorage,
        totalDuration,
        averagePlaysPerTrack,
        monthlyStreams: 0,   // you can compute from last 30 days if needed
        avgDailyStreams: 0,
      };

      this.topTracks = topTracks.map(t => ({
        id: t.id,
        name: t.title || t.name,
        artist: t.artist,
        plays: t.play_count || 0,
        duration: t.duration,
      }));

      // Build distributions
      const genreDistribution = Object.entries(genreMap).map(([name, value]) => ({ name, value }));
      const fileFormatDistribution = Object.entries(formatMap).map(([name, value]) => ({ name, value }));

      return {
        stats: this.stats,
        genreDistribution,
        fileFormatDistribution,
        topTracks: this.topTracks,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return this.getEmptyStats();
    }
  }
  
  //  Fetch chart data – currently not implemented in backend, so we generate mock trends
  async fetchChartData(timeRange = 'monthly') {
    try {
      const response = await tuneAPI.getTimelineData({ period: timeRange, range: 6 });
      const chartData = response?.data?.data;
      if (chartData && chartData.labels && chartData.datasets) {
        this.chartData = chartData;
        return this.chartData;
      } else {
        throw new Error('Invalid chart data');
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      return this.getMockChartData();
    }
  }

  async fetchTimelineData(period = 'month', limit = 6) {
    try {
      const response = await tuneAPI.getTimelineData({ period, limit });
      if (response?.data?.success) {
        this.chartData = response.data.data;
        return this.chartData;
      }
      throw new Error('Failed to fetch timeline');
    } catch (error) {
      console.error('Error fetching timeline data:', error);
      return this.getMockChartData();
    }
  }

  
  
  // Fetch top tracks (already fetched in dashboard, but can be used standalone)
  async fetchTopTracks(limit = 10) {
    try {
      const response = await tuneAPI.getMostPlayed({ limit });
      const tracks = response?.data?.data?.tunes || response?.data?.tunes || [];
      this.topTracks = tracks.map(t => ({
        id: t.id,
        name: t.title || t.name,
        artist: t.artist,
        plays: t.stream_count || t.plays || 0,
        duration: t.duration,
      }));
      return this.topTracks;
    } catch (error) {
      console.error('Error fetching top tracks:', error);
      return this.getMockTopTracks(limit);
    }
  }

  //Getters
  getStats() { return this.stats; }
  getChartData() { return this.chartData; }
  getTopTracks() { return this.topTracks; }

  getEmptyStats() {
    return {
      stats: {
        totalPlays: 0,
        downloads: 0,
        totalTracks: 0,
        favoriteTracks: 0,
        storageUsed: 0,
        totalDuration: 0,
        averagePlaysPerTrack: 0,
        monthlyStreams: 0,
        avgDailyStreams: 0,
      },
      genreDistribution: [],
      fileFormatDistribution: [],
      topTracks: []
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
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4,
        }
      ]
    };
  }

  getMockTopTracks(limit) {
    const defaultTracks = [
      { name: 'Summer Vibes', artist: 'DJ Cool', plays: 4521 },
      { name: 'Midnight Drive', artist: 'Electro Flow', plays: 3890 },
      { name: 'Ocean Waves', artist: 'Nature Sounds', plays: 3215 },
      { name: 'Urban Beat', artist: 'City Producers', plays: 2987 },
      { name: 'Mountain High', artist: 'Nature Sounds', plays: 2654 },
    ];
    return defaultTracks.slice(0, limit);
  }
}

export default AnalyticsModel;