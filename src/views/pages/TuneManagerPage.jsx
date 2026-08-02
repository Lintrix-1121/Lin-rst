import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import TuneList from '../components/tunes/TuneList';
import TuneController from '../../controllers/TuneController';

const TuneManagerPage = () => {
  const [controller] = useState(() => new TuneController());
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allTunes, setAllTunes] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);


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

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const tunes = await controller.loadTunes({ limit: 1000 });
      setAllTunes(tunes);
      setStats({ statistics: computeStats(tunes), format_breakdown: computeStats(tunes).format_breakdown });
      //Load tunes to populate model's internal array
      //await controller.loadTunes({ limit: 1000 });
      //then fetch statistics using server or falls back to local data
      //const statsData = await controller.getTuneStatistics();
      //setStats(statsData);
    } catch (err) {
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

   const handleTunesLoaded = useCallback((tunes) => {
    setAllTunes(tunes);
    const computed = computeStats(tunes);
    setStats({ statistics: computed, format_breakdown: computed.format_breakdown });
  }, [computeStats]);

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Loading statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-4">
        <i className="bi bi-exclamation-triangle me-2" />
        {error}
        <Button variant="outline-danger" size="sm" className="ms-3" onClick={loadStats}>
          Retry
        </Button>
      </Alert>
    );
  }

  const s = stats?.statistics || {};

  return (
    <div className="section-container p-3">
      <div className="section-header mb-4">
        <h2>
          <i className="bi bi-music-note-list me-2" />
          Tune Manager
        </h2>
        <p className="text-muted">Manage your music library with advanced analytics</p>
      </div>

      {/* Statistics Dashboard */}
      <Row className="g-3 mb-4">
        <Col md={3} sm={6}>
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted">Total Tunes</h6>
              <h3 className="text-primary">{s.total_tunes || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted">Total Plays</h6>
              <h3 className="text-success">{s.total_plays || s.total_streams || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted">Favorites</h6>
              <h3 className="text-warning">{s.favorite_tunes || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <h6 className="text-muted">Avg Rating</h6>
              <h3 className="text-info">{s.average_rating || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Extended Stats */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h6 className="text-muted">
                <i className="bi bi-hdd me-2" />
                Storage
              </h6>
              <div>
                <span className="fw-bold">
                  {s.total_storage_gb || 0} GB
                </span>
                <small className="text-muted ms-2">
                  ({s.total_storage_bytes || 0} bytes)
                </small>
              </div>
              <div className="mt-2">
                <small className="text-muted">Avg Duration:</small>
                <span className="ms-2">{s.average_duration || 0}s</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h6 className="text-muted">
                <i className="bi bi-file-earmark-music me-2" />
                Format Breakdown
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {stats?.format_breakdown?.map((f) => (
                  <Badge
                    key={f.format}
                    bg="light"
                    text="dark"
                    className="p-2 border"
                    style={{ fontSize: '0.9rem' }}
                  >
                    {f.format.toUpperCase()}: {f.count} (
                    {(f.total_size / (1024 * 1024 * 1024)).toFixed(2)} GB)
                  </Badge>
                )) || <span className="text-muted">No data</span>}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Tune List */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <TuneList controller={controller} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TuneManagerPage;