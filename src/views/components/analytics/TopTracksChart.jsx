import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';

const TopTracksChart = ({ tracks }) => {
  const safeTracks = tracks && tracks.length > 0 ? tracks : [
    { name: 'No Tracks', artist: '', plays: 0 }
  ];

  const formatPlays = (plays) => {
    if (plays >= 1000) return (plays / 1000).toFixed(1) + 'K';
    return plays;
  };

  return (
    <ListGroup variant="flush">
      {safeTracks.map((track, index) => (
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
      {safeTracks.length === 1 && safeTracks[0].name === 'No Tracks' && (
        <p className="text-muted text-center mt-3">No track data available</p>
      )}
    </ListGroup>
  );
};

export default TopTracksChart;