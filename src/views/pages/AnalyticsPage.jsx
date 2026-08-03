import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Spinner, Alert, Form } from 'react-bootstrap';
import StatsCards from '../components/analytics/StatsCards';
import Charts from '../components/analytics/Charts';
import TopTracks from '../components/analytics/TopTracks';
import TuneController from '../../controllers/TuneController';

const AnalyticsPage = () => {
  const [tuneController] = useState(() => new TuneController());
  const [stats, setStats] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //computeStats logic from TuneManagerPage
  const computeStats = useCallback((tunes) => {
    if (!Array.isArray(tunes) || tunes.length === 0) {
      return {
        total_tunes: 0,
        total_plays: 0,
        favorite_tunes: 0,
        average_rating: 0,
        total_storage_bytes: 0,
        total_storage_gb: 0,
        average_duration: 0,
        format_breakdown: [],
      };
    }

    const totalPlays = tunes.reduce((sum, t) => sum + (t.play_count || 0), 0);
    const totalStorage = tunes.reduce((sum, t) => sum + (t.file_size || 0), 0);
    const totalDuration = tunes.reduce((sum, t) => sum + (t.duration || 0), 0);
    const favoriteTunes = tunes.filter(t => t.favorite).length;
    const totalTunes = tunes.length;
    const averageRating = totalTunes > 0
      ? (tunes.reduce((sum, t) => sum + (t.rating || 0), 0) / totalTunes).toFixed(1)
      : 0;
    const averageDuration = totalTunes > 0
      ? (totalDuration / totalTunes).toFixed(2)
      : 0;

    return {
      total_tunes: totalTunes,
      total_plays: totalPlays,
      favorite_tunes: favoriteTunes,
      average_rating: averageRating,
      total_storage_bytes: totalStorage,
      total_storage_gb: (totalStorage / (1024 * 1024 * 1024)).toFixed(2),
      average_duration: averageDuration,
    };
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      //Load full tune list
      const tunes = await tuneController.loadTunes({ limit: 1000 });
      const computed = computeStats(tunes);

      //Get monthly & avg daily streams from server (optional, fallback to 0)
      let monthlyStreams = 0;
      let avgDailyStreams = 0;
      try {
        const monthlyData = await tuneController.getOverallMonthlyStreams();
        monthlyStreams = monthlyData?.total_streams || 0;
      } catch (e) {
        console.warn('Monthly streams unavailable:', e);
      }
      try {
        const avgData = await tuneController.getAverageStreams({ days: 30 });
        avgDailyStreams = avgData?.average_streams_per_day
          ? parseFloat(avgData.average_streams_per_day).toFixed(1)
          : 0;
      } catch (e) {
        console.warn('Avg daily streams unavailable:', e);
      }

      //Top tracks sorted by play_count
      const sorted = [...tunes].sort((a, b) => (b.play_count || 0) - (a.play_count || 0));
      setTopTracks(sorted.slice(0, 10));

      //Timeline chart data
      let chart = null;
      try {
        chart = await tuneController.getTimelineData({ period: timeRange, limit: 6 });
      } catch (e) {
        console.warn('Timeline data unavailable:', e);
        
        chart = { labels: [], datasets: [] };
      }

      //Set stats aggregate for cards
      setStats({
        totalStreams: computed.total_plays,
        totalDownloads: 0, 
        monthlyStreams,
        avgDailyStreams,
        totalTracks: computed.total_tunes,
        favorites: computed.favorite_tunes,
        avgRating: computed.average_rating,
        storageGB: computed.total_storage_gb,
      });

      setChartData(chart);

    } catch (err) {
      console.error('Analytics load error:', err);
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [tuneController, computeStats, timeRange]);

  useEffect(() => {
    loadData();
  }, [loadData, timeRange]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-container">
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2" />
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="section-container">
      <div className="section-header d-flex justify-content-between align-items-center">
        <div>
          <h2><i className="bi bi-graph-up me-2"></i>Analytics Dashboard</h2>
          <p className="text-muted">Track performance and user engagement</p>
        </div>
        <Form.Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="day">Last 7 Days</option>
          <option value="week">Last 4 Weeks</option>
          <option value="month">Last 6 Months</option>
          <option value="year">Last Year</option>
        </Form.Select>
      </div>

      {stats && (
        <>
          <Row className="mb-4">
            <Col>
              <StatsCards stats={stats} />
            </Col>
          </Row>
          <Row>
            <Col lg={8}>
              <Charts chartData={chartData} timeRange={timeRange} />
            </Col>
            <Col lg={4}>
              <TopTracks tracks={topTracks} />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;


