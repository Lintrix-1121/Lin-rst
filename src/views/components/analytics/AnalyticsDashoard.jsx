import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, 
  Form, Spinner, Alert, Badge 
} from 'react-bootstrap';
import AnalyticsController from '../../../controllers/AnalyticsController';
import PlayHistoryChart from './PlayHistoryChart';
import GenreDistributionChart from './GenreDistributionChart';
import TopTracksChart from './TopTracksChart';
import FileFormatChart from './FIleFormatChart';

const AnalyticsDashboard = () => {
  const [analyticsController] = useState(() => new AnalyticsController());
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboardResult, chartResult, tracksResult] = await Promise.all([
        analyticsController.loadDashboardData(),
        analyticsController.loadChartData(timeRange),
        analyticsController.loadTopTracks(10)
      ]);

      setDashboardData(dashboardResult);
      setChartData(chartResult);
      setTopTracks(tracksResult);

    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <div>Loading analytics...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">
            <i className="bi bi-graph-up text-primary me-2"></i>
            Analytics Dashboard
          </h1>
          <p className="text-muted mb-0">
            Insights and statistics about your tune library
          </p>
        </div>
        <Form.Select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="daily">Last 7 Days</option>
          <option value="weekly">Last 4 Weeks</option>
          <option value="monthly">Last 6 Months</option>
          <option value="yearly">Last Year</option>
        </Form.Select>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <div className="flex-grow-1">{error}</div>
            <Button variant="outline-danger" size="sm" onClick={loadAnalyticsData}>
              Retry
            </Button>
          </div>
        </Alert>
      )}

      {/* Quick Stats */}
      {dashboardData?.stats && (
        <Row className="mb-4">
          <Col xl={3} lg={6} className="mb-3">
            <Card className="h-100 border-0 bg-primary  text-white-100">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <div className="h6 mb-1 opacity-75">Total Plays</div>
                    <div className="h3 mb-0">{formatNumber(dashboardData.stats.totalPlays)}</div>
                    <small className="opacity-75">
                      {dashboardData.stats.averagePlaysPerTrack} avg per track
                    </small>
                  </div>
                  <i className="bi bi-play-circle display-6 opacity-50"></i>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={6} className="mb-3">
            <Card className="h-100 border-0 bg-success text-white">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <div className="h6 mb-1 opacity-75">Downloads</div>
                    <div className="h3 mb-0">{formatNumber(dashboardData.stats.downloads)}</div>
                    <small className="opacity-75">
                      {Math.round((dashboardData.stats.downloads / dashboardData.stats.totalPlays) * 100)}% conversion
                    </small>
                  </div>
                  <i className="bi bi-download display-6 opacity-50"></i>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={6} className="mb-3">
            <Card className="h-100 border-0 bg-warning text-dark">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <div className="h6 mb-1 opacity-75">Library Size</div>
                    <div className="h3 mb-0">{dashboardData.stats.totalTracks}</div>
                    <small className="opacity-75">
                      {dashboardData.stats.favoriteTracks} favorites
                    </small>
                  </div>
                  <i className="bi bi-music-note-list display-6 opacity-50"></i>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={6} className="mb-3">
            <Card className="h-100 border-0 bg-info text-white">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <div className="h6 mb-1 opacity-75">Storage Used</div>
                    <div className="h3 mb-0">{formatFileSize(dashboardData.stats.storageUsed)}</div>
                    <small className="opacity-75">
                      {Math.round(dashboardData.stats.totalDuration / 3600)} total hours
                    </small>
                  </div>
                  <i className="bi bi-hdd display-6 opacity-50"></i>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Charts Grid */}
      <Row>
        {/* Play History Chart */}
        <Col xl={8} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-white border-bottom-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-primary">
                  <i className="bi bi-bar-chart text-primary me-2"></i>
                  Play History
                </h5>
                <Badge bg="light" text="dark">
                  {timeRange}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <PlayHistoryChart chartData={chartData} timeRange={timeRange} />
            </Card.Body>
          </Card>
        </Col>

        {/* Top Tracks */}
        <Col xl={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-white border-bottom-0">
              <h5 className="mb-0 text-warning">
                <i className="bi bi-trophy text-warning me-2"></i>
                Top Tracks
              </h5>
            </Card.Header>
            <Card.Body>
              <TopTracksChart topTracks={topTracks} />
            </Card.Body>
          </Card>
        </Col>

        {/* Genre Distribution */}
        <Col lg={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-white border-bottom-0">
              <h5 className="mb-0 text-success">
                <i className="bi bi-pie-chart text-success me-2"></i>
                Genre Distribution
              </h5>
            </Card.Header>
            <Card.Body>
              <GenreDistributionChart dashboardData={dashboardData} />
            </Card.Body>
          </Card>
        </Col>

        {/* File Format Distribution */}
        <Col lg={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-white opacity-95 border-bottom-0">
              <h5 className="mb-0 text-info">
                <i className="bi bi-file-earmark-music text-info me-2"></i>
                File Formats
              </h5>
            </Card.Header>
            <Card.Body>
              <FileFormatChart dashboardData={dashboardData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AnalyticsDashboard;