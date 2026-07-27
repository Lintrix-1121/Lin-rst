import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import TuneList from '../components/tunes/TuneList';
import TuneController from '../../controllers/TuneController';

const TuneManagerPage = () => {
  const [tuneController] = useState(() => new TuneController());
  const [stats, setStats] = useState({ totalTracks: 0, totalStreams: 0, totalDownloads: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const tunes = await tuneController.loadTunes({ limit: 1000 });
      const totalTracks = tunes.length;
      const totalStreams = tunes.reduce((sum, t) => sum + (t.stream_count || 0), 0);
      const totalDownloads = tunes.reduce((sum, t) => sum + (t.download_count || 0), 0);
      setStats({ totalTracks, totalStreams, totalDownloads });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h2><i className="bi bi-music-note-list me-2"></i>Tune Manager</h2>
        <p className="text-muted">Manage your tune library</p>
      </div>

      {/* Stats row */}
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <h6>Total Tracks</h6>
              <h3>{stats.totalTracks}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h6>Total Streams</h6>
              <h3>{stats.totalStreams}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h6>Total Downloads</h6>
              <h3>{stats.totalDownloads}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <TuneList />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TuneManagerPage;