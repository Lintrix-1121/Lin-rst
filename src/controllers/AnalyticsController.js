import AnalyticsModel from '../models/AnalyticsModel';

class AnalyticsController {
  constructor() {
    this.model = new AnalyticsModel();
    this.loading = false;
    this.error = null;
  }

  async loadDashboardData() {
    console.log(' AnalyticsController.loadDashboardData called');
    this.loading = true;
    this.error = null;

    try {
      const dashboardData = await this.model.fetchDashboardStats();
      console.log('Dashboard data loaded successfully:', dashboardData);
      this.loading = false;
      return dashboardData;
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async loadChartData(timeRange = 'monthly') {
    console.log('AnalyticsController.loadChartData called with timeRange:', timeRange);
    this.loading = true;
    this.error = null;

    try {
      const chartData = await this.model.fetchChartData(timeRange);
      console.log('Chart data loaded successfully:', chartData);
      this.loading = false;
      return chartData;
    } catch (error) {
      console.error('Error loading chart data:', error);
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  async loadTopTracks(limit = 10) {
    console.log('AnalyticsController.loadTopTracks called with limit:', limit);
    this.loading = true;
    this.error = null;

    try {
      const topTracks = await this.model.fetchTopTracks(limit);
      console.log('Top tracks loaded successfully:', topTracks.length, 'tracks');
      this.loading = false;
      return topTracks;
    } catch (error) {
      console.error('Error loading top tracks:', error);
      this.loading = false;
      this.error = error.message;
      throw error;
    }
  }

  getStats() {
    return this.model.getStats();
  }

  getChartData() {
    return this.model.getChartData();
  }

  getTopTracks() {
    return this.model.getTopTracks();
  }

  isLoading() {
    return this.loading;
  }

  getError() {
    return this.error;
  }
}

export default AnalyticsController;

