import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TuneController from '../../controllers/TuneController';

const Dashboard = () => {
  const [tuneController] = useState(() => new TuneController());
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalTracks: 0,
      storageUsed: 0,
      totalPlays: 0,
      favorites: 0,
      avgRating: 0,
      monthlyStreams: 0,
      avgDailyStreams: 0,
      recentUploads: 0,
    },
    topTracks: [],
    formatBreakdown: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

    // Format breakdown
    const formatMap = {};
    tunes.forEach(t => {
      const fmt = t.file_format || 'unknown';
      if (!formatMap[fmt]) formatMap[fmt] = { format: fmt, count: 0, total_size: 0 };
      formatMap[fmt].count++;
      formatMap[fmt].total_size += (t.file_size || 0);
    });
    const formatBreakdown = Object.values(formatMap).map(f => ({
      ...f,
      total_size_gb: (f.total_size / (1024 * 1024 * 1024)).toFixed(3)
    }));

    return {
      total_tunes: totalTunes,
      total_plays: totalPlays,
      favorite_tunes: favoriteTunes,
      average_rating: averageRating,
      total_storage_bytes: totalStorage,
      total_storage_gb: (totalStorage / (1024 * 1024 * 1024)).toFixed(2),
      average_duration: averageDuration,
      format_breakdown: formatBreakdown,
    };
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      //Load the full tune list the single source of truth
      const tunes = await tuneController.loadTunes({ limit: 1000 });
      const computed = computeStats(tunes);

      //For monthly & avg daily streams still rely on server endpoints
      // these are not derivable from the tune list alone
      let monthlyStreams = 0;
      let avgDailyStreams = 0;
      try {
        const monthlyData = await tuneController.getOverallMonthlyStreams();
        monthlyStreams = monthlyData?.total_streams || 0;
      } catch (e) {
        console.warn('Failed to fetch monthly streams:', e);
      }
      try {
        const avgData = await tuneController.getAverageStreams({ days: 30 });
        avgDailyStreams = avgData?.average_streams_per_day
          ? parseFloat(avgData.average_streams_per_day).toFixed(1)
          : 0;
      } catch (e) {
        console.warn('Failed to fetch avg daily streams:', e);
      }

      //Compute recent uploads (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentUploads = tunes.filter(t => {
        const date = new Date(t.createdAt || t.created_at);
        return date >= sevenDaysAgo;
      }).length;

      //Top 5 most played tunes computed from the list
      const topTracks = [...tunes]
        .sort((a, b) => (b.play_count || 0) - (a.play_count || 0))
        .slice(0, 5);

      setDashboardData({
        stats: {
          totalTracks: computed.total_tunes,
          storageUsed: parseFloat(computed.total_storage_gb),
          totalPlays: computed.total_plays,
          favorites: computed.favorite_tunes,
          avgRating: computed.average_rating,
          monthlyStreams,
          avgDailyStreams,
          recentUploads,
        },
        topTracks,
        formatBreakdown: computed.format_breakdown,
      });
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [tuneController, computeStats]);

  // Quick action card 
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

  // Loading / Error states 
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

  const { stats, topTracks, formatBreakdown } = dashboardData;

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
                  <h3 className="text-info">{stats.storageUsed.toFixed(1)} GB</h3>
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
                  <h6 className="card-title">Favorites</h6>
                  <h3 className="text-warning">{stats.favorites}</h3>
                </div>
                <i className="bi bi-heart display-6 text-muted"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Avg Rating</h6>
                  <h3 className="text-primary">{stats.avgRating}</h3>
                </div>
                <i className="bi bi-star display-6 text-muted"></i>
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
                  <h3 className="text-info">{stats.monthlyStreams}</h3>
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
                  <h3 className="text-success">{stats.avgDailyStreams}</h3>
                </div>
                <i className="bi bi-graph-up display-6 text-muted"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Recent Uploads</h6>
                  <h3 className="text-warning">{stats.recentUploads}</h3>
                </div>
                <i className="bi bi-clock-history display-6 text-muted"></i>
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

      {/* Format Breakdown & Top Tracks */}
      <Row>
        <Col lg={6}>
          <Card className="h-100">
            <Card.Body>
              <h6>Format Breakdown</h6>
              {formatBreakdown && formatBreakdown.length > 0 ? (
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {formatBreakdown.map((f) => (
                    <Badge key={f.format} bg="light" text="dark" className="p-2 border">
                      {f.format.toUpperCase()}: {f.count} ({f.total_size_gb} GB)
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3 text-muted">
                  <i className="bi bi-file-earmark display-4"></i>
                  <p>No format data available</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <Card.Body>
              <h6>Top 5 Tracks</h6>
              {topTracks && topTracks.length > 0 ? (
                topTracks.map((track, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div>
                      <div className="fw-bold">{track.title || 'Unknown'}</div>
                      <small className="text-muted">{track.artist || 'Unknown Artist'}</small>
                    </div>
                    <span className="badge bg-primary">{track.play_count || 0}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-3 text-muted">
                  <i className="bi bi-music-note-beamed display-4"></i>
                  <p>No track data available</p>
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