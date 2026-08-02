// components/tunes/TuneStats.jsx
import React, { useState, useEffect } from 'react';
import { Spinner, Alert, Row, Col, Card } from 'react-bootstrap';

const TuneStats = ({ tuneId, controller }) => {
  const [stats, setStats] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [repeatRate, setRepeatRate] = useState(null);
  const [playlistAdds, setPlaylistAdds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Guard against missing controller
    if (!controller) {
      setError('Controller not available');
      setLoading(false);
      return;
    }

    const loadStats = async () => {
      try {
        setLoading(true);
        const [s, m, rr, pa] = await Promise.all([
          controller.getPlaybackStats(tuneId),
          controller.getMonthlyStreams(tuneId),
          controller.getRepeatRate(tuneId),
          controller.getPlaylistAddCount(tuneId)
        ]);
        setStats(s);
        setMonthly(m);
        setRepeatRate(rr);
        setPlaylistAdds(pa);
      } catch (err) {
        setError(err.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [tuneId, controller]);

  if (loading) return <Spinner animation="border" size="sm" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <Row className="g-2">
        <Col md={6}>
          <Card className="bg-light">
            <Card.Body>
              <h6>Playback Stats</h6>
              <div><strong>Total Plays:</strong> {stats?.play_count || stats?.total_plays || 0}</div>
              <div><strong>Total Skips:</strong> {stats?.skip_count || stats?.total_skips || 0}</div>
              <div><strong>Last Played:</strong> {stats?.last_played ? new Date(stats.last_played).toLocaleString() : 'Never'}</div>
              <div><strong>Rating:</strong> {stats?.rating || 0}</div>
              <div><strong>Favorite:</strong> {stats?.favorite ? 'Yes' : 'No'}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="bg-light">
            <Card.Body>
              <h6>Engagement</h6>
              <div><strong>Repeat Rate:</strong> {repeatRate?.repeat_rate || 0}%</div>
              <div><strong>Playlist Adds:</strong> {playlistAdds?.playlist_add_count || 0}</div>
              <div><strong>Monthly Streams (this month):</strong> {monthly?.monthly_streams || 0}</div>
              <div><strong>Total Streams (all time):</strong> {monthly?.total_streams || stats?.play_count || 0}</div>
              <div><strong>Period:</strong> {monthly?.period || 'N/A'}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TuneStats;