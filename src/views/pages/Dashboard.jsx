import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TuneController from '../../controllers/TuneController';

const Dashboard = () => {
  const [tuneController] = useState(() => new TuneController());
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalTracks: 0,
      storageUsed: 0,
      totalPlays: 0,
      downloads: 0,
      monthlyStreams: 0,
      avgDailyStreams: 0,
      recentUploads: 0,
    },
    topTracks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all needed data in parallel
      const [
        totalStats,
        monthlyStats,
        avgStats,
        topTracks,
        recentTunes
      ] = await Promise.all([
        tuneController.getTotalStats(),
        tuneController.getOverallMonthlyStreams(),
        tuneController.getAverageStreams({ days: 30 }),
        tuneController.getMostPlayed({ limit: 5 }),
        tuneController.getRecentTunes({ limit: 10 })
      ]);

      // Compute recent uploads (within last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentUploads = Array.isArray(recentTunes)
        ? recentTunes.filter(tune => new Date(tune.createdAt || tune.created_at) >= sevenDaysAgo).length
        : 0;

      // Storage used in GB
      const storageGB = totalStats.total_storage
        ? parseFloat((totalStats.total_storage / (1024 * 1024 * 1024)).toFixed(1))
        : 0;

      setDashboardData({
        stats: {
          totalTracks: totalStats.total_tracks || 0,
          storageUsed: storageGB,
          totalPlays: totalStats.total_streams || 0,
          downloads: totalStats.total_downloads || 0,
          monthlyStreams: monthlyStats?.total_streams || 0,
          avgDailyStreams: avgStats?.average_streams_per_day
            ? parseFloat(avgStats.average_streams_per_day).toFixed(1)
            : 0,
          recentUploads: recentUploads,
        },
        topTracks: Array.isArray(topTracks) ? topTracks : [],
      });
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [tuneController]);

  // Quick action card component
  const QuickActionCard = ({ title, description, icon, action, buttonText, variant = 'primary' }) => (
    <Card className="h-100 quick-action-card">
      <Card.Body className="d-flex flex-column">
        <div className="mb-3">
          <i className={`${icon} display-6 text-${variant}`}></i>
        </div>
        <h5>{title}</h5>
        <p className="text-muted flex-grow-1">{description}</p>
        <Button variant={variant} onClick={action} className="mt-auto">
          {buttonText}
        </Button>
      </Card.Body>
    </Card>
  );

  // Loading state
  if (loading) {
    return (
      <div className="section-container">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <div className="mt-3">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="section-container">
        <div className="text-center py-5">
          <i className="bi bi-exclamation-triangle display-4 text-danger"></i>
          <h4 className="mt-3">Failed to load dashboard</h4>
          <p className="text-muted">{error}</p>
          <Button variant="primary" onClick={loadDashboardData}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { stats, topTracks } = dashboardData;

  return (
    <div className="section-container">
      <div className="section-header">
        <h2><i className="bi bi-speedometer2 me-2"></i>Dashboard</h2>
        <p className="text-muted">Overview of your music library and analytics</p>
      </div>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Tracks</h6>
                  <h3 className="text-primary">{stats.totalTracks}</h3>
                </div>
                <i className="bi bi-music-note-list display-6 text-muted"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Storage Used</h6>
                  <h3 className="text-info">{stats.storageUsed} GB</h3>
                </div>
                <i className="bi bi-hdd display-6 text-muted"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Plays</h6>
                  <h3 className="text-success">{stats.totalPlays}</h3>
                </div>
                <i className="bi bi-play-circle display-6 text-muted"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Downloads</h6>
                  <h3 className="text-warning">{stats.downloads}</h3>
                </div>
                <i className="bi bi-download display-6 text-muted"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Monthly Streams</h6>
                  <h3 className="text-primary">{stats.monthlyStreams}</h3>
                </div>
                <i className="bi bi-calendar3 display-6 text-muted"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Avg Daily Streams</h6>
                  <h3 className="text-info">{stats.avgDailyStreams}</h3>
                </div>
                <i className="bi bi-graph-up display-6 text-muted"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col lg={4} className="mb-3">
          <QuickActionCard
            title="Upload Music"
            description="Add new audio and video files to your library"
            icon="bi-cloud-upload"
            action={() => navigate('/upload')}
            buttonText="Upload Files"
            variant="primary"
          />
        </Col>
        <Col lg={4} className="mb-3">
          <QuickActionCard
            title="View Analytics"
            description="Explore detailed statistics and performance metrics"
            icon="bi-graph-up"
            action={() => navigate('/analytics')}
            buttonText="View Analytics"
            variant="success"
          />
        </Col>
        <Col lg={4} className="mb-3">
          <QuickActionCard
            title="Manage Tunes"
            description="Edit metadata and organize your music collection"
            icon="bi-music-note-list"
            action={() => navigate('/tunes')}
            buttonText="Manage Tunes"
            variant="info"
          />
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col lg={6}>
          <Card>
            <Card.Body>
              <h6>Recent Uploads</h6>
              {stats.recentUploads > 0 ? (
                <div className="text-center py-3">
                  <i className="bi bi-music-note-list display-4 text-primary"></i>
                  <p className="mt-2">
                    <strong>{stats.recentUploads}</strong> new tracks uploaded in the last 7 days
                  </p>
                </div>
              ) : (
                <div className="text-center py-3 text-muted">
                  <i className="bi bi-clock-history display-4"></i>
                  <p>No recent uploads</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <Card.Body>
              <h6>Top Tracks</h6>
              {topTracks.length > 0 ? (
                topTracks.map((track, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div>
                      <div className="fw-bold">{track.title || track.name || 'Unknown'}</div>
                      <small className="text-muted">{track.artist || 'Unknown Artist'}</small>
                    </div>
                    <span className="badge bg-primary">{track.play_count || track.plays || 0}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-3 text-muted">
                  <i className="bi bi-music-note-beamed display-4"></i>
                  <p>No top tracks data available</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;