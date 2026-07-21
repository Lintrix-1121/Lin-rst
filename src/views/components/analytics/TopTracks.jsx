import React from 'react';
import { Card } from 'react-bootstrap';

const TopTracks = ({ tracks }) => {
  const defaultTracks = [
    { name: 'Summer Vibes', artist: 'DJ Cool', plays: 4521 },
    { name: 'Midnight Drive', artist: 'Electro Flow', plays: 3890 },
    { name: 'Ocean Waves', artist: 'Nature Sounds', plays: 3215 },
    { name: 'Urban Beat', artist: 'City Producers', plays: 2987 },
  ];

  const displayTracks = tracks && tracks.length > 0 ? tracks : defaultTracks;

  return (
    <Card>
      <Card.Body>
        <h6>Top Tracks</h6>
        {displayTracks.slice(0, 5).map((track, index) => (
          <div key={index} className="track-item d-flex justify-content-between align-items-center p-2 border-bottom">
            <div>
              <div className="fw-bold">{track.name}</div>
              <small className="text-muted">{track.artist}</small>
            </div>
            <div className="text-primary fw-bold">{track.plays.toLocaleString()}</div>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default TopTracks;