import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';

const TopTracksChart = ({ topTracks }) => {
  const formatPlays = (plays) => {
    if (plays >= 1000) return (plays / 1000).toFixed(1) + 'K';
    return plays;
  };

  const defaultTracks = [
    { name: 'Summer Vibes', artist: 'DJ Cool', plays: 4521 },
    { name: 'Midnight Drive', artist: 'Electro Flow', plays: 3890 },
    { name: 'Ocean Waves', artist: 'Nature Sounds', plays: 3215 },
    { name: 'Urban Beat', artist: 'City Producers', plays: 2987 },
    { name: 'Mountain High', artist: 'Nature Sounds', plays: 2654 }
  ];

  const tracks = topTracks && topTracks.length > 0 ? topTracks : defaultTracks;

  return (
    <ListGroup variant="flush">
      {tracks.map((track, index) => (
        <ListGroup.Item 
          key={index}
          className="d-flex justify-content-between align-items-center px-0 py-3 border-bottom"
        >
          <div className="d-flex align-items-center">
            <div 
              className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle me-3"
              style={{ width: '32px', height: '32px', fontSize: '0.8rem', fontWeight: 'bold' }}
            >
              {index + 1}
            </div>
            <div>
              <div className="fw-semibold text-truncate" style={{ maxWidth: '200px' }}>
                {track.name}
              </div>
              <small className="text-muted">{track.artist}</small>
            </div>
          </div>
          <Badge bg="outline-primary" className="fs-6">
            {formatPlays(track.plays)}
          </Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default TopTracksChart;