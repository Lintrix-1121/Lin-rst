import React, { useState, useEffect } from 'react';
import { Spinner, Alert, Row, Col, Card, Badge } from 'react-bootstrap';

const TuneStats = ({ tuneId, controller }) => {
  const [stats, setStats] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [repeatRate, setRepeatRate] = useState(null);
  const [playlistAdds, setPlaylistAdds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        setError(err.message);
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
              <div><strong>Total Plays:</strong> {stats?.total_plays || 0}</div>
              <div><strong>Total Skips:</strong> {stats?.total_skips || 0}</div>
              <div><strong>Last Played:</strong> {stats?.last_played ? new Date(stats.last_played).toLocaleString() : 'Never'}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="bg-light">
            <Card.Body>
              <h6>Engagement</h6>
              <div><strong>Repeat Rate:</strong> {repeatRate?.repeat_rate || 0}%</div>
              <div><strong>Playlist Adds:</strong> {playlistAdds || 0}</div>
              <div><strong>Favorite:</strong> {stats?.favorite ? 'Yes' : 'No'}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {monthly?.streams && (
        <div className="mt-3">
          <h6>Monthly Streams</h6>
          <div className="d-flex flex-wrap gap-2">
            {monthly.streams.map((m, i) => (
              <Badge key={i} bg="info" className="p-2">
                {m.month}: {m.count}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};