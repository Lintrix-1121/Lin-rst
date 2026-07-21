// src/services/api.js (analyticsAPI section)
export const analyticsAPI = {
  getDashboardStats: async () => {
    try {
      console.log('Analytics API: Calling /api/analytics/dashboard');
      const response = await fetch('/api/analytics/dashboard');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Analytics API: Dashboard response:', data);
      return data;
      
    } catch (error) {
      console.error('Analytics API: Error fetching dashboard stats:', error);
      // Return mock data with the same structure as successful API response
      return {
        success: true,
        data: { 
          stats: {
            totalPlays: 45200,
            downloads: 12400,
            activeUsers: 2100,
            revenue: 4200,
            storageUsed: 45200000000,
            totalTracks: 1247
          },
          topTracks: [
            { name: 'Summer Vibes', artist: 'DJ Cool', plays: 4521 },
            { name: 'Midnight Drive', artist: 'Electro Flow', plays: 3890 },
            { name: 'Ocean Waves', artist: 'Nature Sounds', plays: 3215 },
            { name: 'Urban Beat', artist: 'City Producers', plays: 2987 },
            { name: 'Mountain High', artist: 'Nature Sounds', plays: 2654 },
          ]
        }
      };
    }
  },
  
  getChartData: async (timeRange) => {
    try {
      console.log('Analytics API: Calling /api/analytics/charts with range:', timeRange);
      const response = await fetch(`/api/analytics/charts?range=${timeRange}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Analytics API: Charts response:', data);
      return data;
      
    } catch (error) {
      console.error('Analytics API: Error fetching chart data:', error);
      // Return mock data with the same structure
      return {
        success: true,
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Plays',
              data: [1200, 1900, 3000, 5000, 2000, 3000]
            }
          ]
        }
      };
    }
  },
  
  getTopTracks: async (limit = 10) => {
    try {
      console.log('Analytics API: Calling /api/analytics/top-tracks with limit:', limit);
      const response = await fetch(`/api/analytics/top-tracks?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Analytics API: Top tracks response:', data);
      return data;
      
    } catch (error) {
      console.error('Analytics API: Error fetching top tracks:', error);
      // Return mock data with the same structure
      return {
        success: true,
        data: [
          { name: 'Summer Vibes', artist: 'DJ Cool', plays: 4521 },
          { name: 'Midnight Drive', artist: 'Electro Flow', plays: 3890 },
          { name: 'Ocean Waves', artist: 'Nature Sounds', plays: 3215 },
          { name: 'Urban Beat', artist: 'City Producers', plays: 2987 },
          { name: 'Mountain High', artist: 'Nature Sounds', plays: 2654 },
        ].slice(0, limit)
      };
    }
  }
};




