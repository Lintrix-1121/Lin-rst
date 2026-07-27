
import { tuneAPI } from './api/tuneAPI';

class AnalyticsModel {
  constructor() {
    this.stats = null;
    this.chartData = null;
    this.topTracks = [];
  }

  
  //Fetch all dashboard statistics from the backend
  async fetchDashboardStats() {
    try {
      const totalStats = await tuneAPI.getTotalStats();
      const totalData = totalStats?.data?.data || {};
      const totalTracks = totalData.total_tracks || 0;
      const totalStreams = totalData.total_streams || 0;
      const totalDownloads = totalData.total_downloads || 0;
      const totalStorage = totalData.total_storage || 0;

      const monthlyData = await tuneAPI.getOverallMonthlyStreams();
      const monthlyStreams = monthlyData?.data?.total_streams || 0;

      const avgData = await tuneAPI.getAverageStreams({ days: 30 });
      const avgDailyStreams = parseFloat(avgData?.data?.average_streams_per_day) || 0;

      const topTracksData = await tuneAPI.getMostPlayed({ limit: 5 });
      const topTracks = topTracksData?.data?.data?.tunes || topTracksData?.data?.tunes || [];

      // No need to fetch all tunes anymore
      this.stats = {
        totalTracks,
        totalStreams,
        totalDownloads,
        totalStorage,
        totalDuration: 0, // we may still need duration, but can skip for now
        favoriteCount: 0, // we can get from a separate endpoint if needed
        monthlyStreams,
        avgDailyStreams,
        averagePlaysPerTrack: totalTracks > 0 ? Math.round(totalStreams / totalTracks) : 0,
      };

      this.topTracks = topTracks.map(t => ({
        id: t.id,
        name: t.title || t.name,
        artist: t.artist,
        plays: t.stream_count || t.plays || 0,
        duration: t.duration,
      }));

      return { stats: this.stats, topTracks: this.topTracks };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return this.getEmptyStats();
    }
  } 
 
 // async fetchDashboardStats() {
  //   try {
  //     console.log('📊 Fetching dashboard stats from backend...');

  //     //Get total tune count and format breakdown usingtotal count
  //     const totalCountData = await tuneAPI.getTotalCount();
  //     const totalTracks = totalCountData?.data?.total_count || 0;

  //     // Get overall monthly streams (current month)
  //     const monthlyData = await tuneAPI.getOverallMonthlyStreams();
  //     const monthlyStreams = monthlyData?.data?.total_streams || 0;

  //     //Get average daily streams over the last 30 days
  //     const avgData = await tuneAPI.getAverageStreams({ days: 30 });
  //     const avgDailyStreams = parseFloat(avgData?.data?.average_streams_per_day) || 0;

  //     // Get top 5 most played tunes (using stream_count)
  //     const topTracksData = await tuneAPI.getMostPlayed({ limit: 5 });
  //     const topTracks = topTracksData?.data?.tunes || [];

  //     //Get all tunes to compute total streams and downloads (or we could add a backend endpoint for totals)
  //     //fetch a large batch to sum stream_count and download_count
  //     const allTunesResponse = await tuneAPI.getAll({ limit: 1000 });
  //     const allTunes = allTunesResponse?.data?.data?.tunes || allTunesResponse?.data?.tunes || [];

  //     let totalStreams = 0;
  //     let totalDownloads = 0;
  //     let totalStorage = 0;
  //     let totalDuration = 0;
  //     let favoriteCount = 0;

  //     allTunes.forEach(tune => {
  //       totalStreams += tune.stream_count || 0;
  //       totalDownloads += tune.download_count || 0;
  //       totalStorage += tune.file_size || 0;
  //       totalDuration += tune.duration || 0;
  //       if (tune.favorite) favoriteCount++;
  //     });

  //     // Build stats object
  //     this.stats = {
  //       totalTracks,
  //       totalStreams,
  //       totalDownloads,
  //       totalStorage,
  //       totalDuration,
  //       favoriteCount,
  //       monthlyStreams,
  //       avgDailyStreams,
  //       // Additional derived metrics
  //       averagePlaysPerTrack: totalTracks > 0 ? Math.round(totalStreams / totalTracks) : 0,
  //     };

  //     // Store top tracks
  //     this.topTracks = topTracks.map(t => ({
  //       id: t.id,
  //       name: t.title || t.name,
  //       artist: t.artist,
  //       plays: t.stream_count || t.plays || 0,
  //       duration: t.duration,
  //     }));

  //     return {
  //       stats: this.stats,
  //       topTracks: this.topTracks,
  //     };
  //   } catch (error) {
  //     console.error('Error fetching dashboard stats:', error);
  //     // Fallback to empty stats
  //     return this.getEmptyStats();
  //   }
  // }

  
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

  //Fallback empty data
  getEmptyStats() {
    return {
      stats: {
        totalTracks: 0,
        totalStreams: 0,
        totalDownloads: 0,
        totalStorage: 0,
        totalDuration: 0,
        favoriteCount: 0,
        monthlyStreams: 0,
        avgDailyStreams: 0,
        averagePlaysPerTrack: 0,
      },
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