import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AnalyticsController from '../../controllers/AnalyticsController';
import TuneController from '../../controllers/TuneController';

const Dashboard = () => {
  const [analyticsController] = useState(() => new AnalyticsController());
  const [tuneController] = useState(() => new TuneController());
  const [dashboardData, setDashboardData] = useState(null);
  const [quickStats, setQuickStats] = useState(null);
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
    console.log('🔄 Starting dashboard data load...');

    const [analyticsData, tunes] = await Promise.all([
      analyticsController.loadDashboardData(),
      tuneController.loadTunes({ limit: 1000 })
    ]);

    console.log('📊 Analytics data received:', analyticsData);
    console.log('🎵 Tunes data received:', tunes);
    console.log('🎵 Number of tunes:', Array.isArray(tunes) ? tunes.length : 'Not an array');

    setDashboardData(analyticsData);
    
    // Calculate quick stats
    const tunesArray = Array.isArray(tunes) ? tunes : [];
    const totalStorage = tunesArray.reduce((acc, tune) => acc + (tune.file_size || 0), 0);
    
    setQuickStats({
      totalTracks: tunesArray.length,
      recentUploads: tunesArray.slice(0, 5).length,
      storageUsed: parseFloat((totalStorage / (1024 * 1024 * 1024)).toFixed(1))
    });

    console.log('✅ Dashboard data loaded successfully');

  } catch (err) {
    console.error('❌ Failed to load dashboard data:', err);
    setError(err.message);
    setQuickStats({
      totalTracks: 0,
      recentUploads: 0,
      storageUsed: 0
    });
    setDashboardData({
      stats: { totalPlays: 0, downloads: 0 },
      topTracks: []
    });
  } finally {
    setLoading(false);
  }
}, [analyticsController, tuneController]);

  const QuickActionCard = ({ title, description, icon, action, buttonText, variant = 'primary' }) => (
    <Card className="h-100 quick-action-card">
      <Card.Body className="d-flex flex-column">
        <div className="mb-3">
          <i className={`${icon} display-6 text-${variant}`}></i>
        </div>
        <h5>{title}</h5>
        <p className="text-muted flex-grow-1">{description}</p>
        <Button 
          variant={variant} 
          onClick={action}
          className="mt-auto"
        >
          {buttonText}
        </Button>
      </Card.Body>
    </Card>
  );

  // Safe slice function for top tracks
  const getTopTracks = () => {
    if (!dashboardData || !dashboardData.topTracks) return [];
    
    if (Array.isArray(dashboardData.topTracks)) {
      return dashboardData.topTracks.slice(0, 5);
    }
    
    return [];
  };

  // Safe access to stats
  const getStats = () => {
    if (!dashboardData) return { totalPlays: 0, downloads: 0 };
    
    return dashboardData.stats || { totalPlays: 0, downloads: 0 };
  };

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

  const topTracks = getTopTracks();
  const stats = getStats();

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
                  <h3 className="text-primary">{quickStats?.totalTracks || 0}</h3>
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
                  <h3 className="text-info">
                    {quickStats ? quickStats.storageUsed.toFixed(1) : '0.0'} GB
                  </h3>
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
                  <h3 className="text-success">{stats.totalPlays || 0}</h3>
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
                  <h3 className="text-warning">{stats.downloads || 0}</h3>
                </div>
                <i className="bi bi-download display-6 text-muted"></i>
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
              {quickStats?.recentUploads > 0 ? (
                <div className="text-center py-3">
                  <i className="bi bi-music-note-list display-4 text-primary"></i>
                  <p className="mt-2">
                    <strong>{quickStats.recentUploads}</strong> new tracks uploaded recently
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
                      <div className="fw-bold">{track.name || track.title || 'Unknown Track'}</div>
                      <small className="text-muted">{track.artist || 'Unknown Artist'}</small>
                    </div>
                    <span className="badge bg-primary">{track.plays || track.play_count || 0}</span>
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
