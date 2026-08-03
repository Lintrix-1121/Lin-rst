import React from 'react';
import { Card } from 'react-bootstrap';

const TopTracks = ({ tracks }) => {
  if (!tracks || tracks.length === 0) {
    return (
      <Card>
        <Card.Body>
          <h6>Top Tracks</h6>
          <div className="text-center py-3 text-muted">
            <i className="bi bi-music-note-beamed display-4"></i>
            <p>No track data available</p>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Body>
        <h6>Top Tracks</h6>
        {tracks.slice(0, 5).map((track, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center p-2 border-bottom"
          >
            <div>
              <div className="fw-bold">{track.title || track.name || 'Unknown'}</div>
              <small className="text-muted">{track.artist || 'Unknown Artist'}</small>
            </div>
            <div className="text-primary fw-bold">
              {(track.play_count || track.plays || 0).toLocaleString()}
            </div>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default TopTracks;