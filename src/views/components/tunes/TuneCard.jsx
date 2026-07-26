import React, { useState } from 'react';
import { Card, Button, Badge, Dropdown } from 'react-bootstrap';

const TuneCard = ({ tune, onEdit, onDelete, onPlay, onDownload }) => {
  const [imageError, setImageError] = useState(false);

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getQualityBadge = (bitrate) => {
    if (!bitrate) return null;
    if (bitrate >= 320) return <Badge bg="success">HQ</Badge>;
    if (bitrate >= 192) return <Badge bg="primary">Good</Badge>;
    return <Badge bg="secondary">Standard</Badge>;
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      // Use the download endpoint
      const downloadUrl = `/api/dold/download/${tune.id}`;
      // Open in new tab or trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${tune.artist} - ${tune.title}.${tune.file_format || 'mp3'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <Card className="h-100 tune-card">
      <div className="tune-card-image-container">
        {tune.cover_art_url && !imageError ? (
          <Card.Img
            variant="top"
            src={tune.cover_art_url}
            alt={`${tune.title} cover`}
            onError={() => setImageError(true)}
            className="tune-card-image"
          />
        ) : (
          <div className="tune-card-placeholder">
            <i className="bi bi-music-note-beamed display-4"></i>
          </div>
        )}
        <div className="tune-card-overlay">
          <Button
            variant="primary"
            size="sm"
            onClick={onPlay}
            className="play-button"
          >
            <i className="bi bi-play-fill"></i>
          </Button>
        </div>
        {tune.favorite && (
          <div className="tune-favorite-badge">
            <i className="bi bi-heart-fill text-danger"></i>
          </div>
        )}
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="tune-title" title={tune.title}>
            {tune.title}
          </Card.Title>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm" id="dropdown-basic">
              <i className="bi bi-three-dots-vertical"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => onEdit(tune)}>
                <i className="bi bi-pencil me-2"></i>
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onPlay(tune.id)}>
                <i className="bi bi-play me-2"></i>
                Play
              </Dropdown.Item>
              <Dropdown.Item onClick={onDownload}>
                <i className="bi bi-download me-2"></i>
                Download
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item 
                onClick={() => onDelete(tune.id)}
                className="text-danger"
              >
                <i className="bi bi-trash me-2"></i>
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Card.Text className="tune-artist text-muted" title={tune.artist}>
          {tune.artist}
        </Card.Text>

        {tune.album && (
          <Card.Text className="tune-album small text-muted" title={tune.album}>
            <i className="bi bi-disc me-1"></i>
            {tune.album}
          </Card.Text>
        )}

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="tune-meta">
              {tune.year && <span className="me-2">{tune.year}</span>}
              {tune.genre && (
                <Badge bg="outline-secondary" text="dark" className="me-1">
                  {tune.genre}
                </Badge>
              )}
              {getQualityBadge(tune.bitrate)}
            </div>
            {tune.rating > 0 && (
              <div className="tune-rating">
                <i className="bi bi-star-fill text-warning"></i>
                <small className="ms-1">{tune.rating}</small>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center tune-stats">
            <div className="tune-duration">
              <i className="bi bi-clock me-1"></i>
              {formatDuration(tune.duration)}
            </div>
            <div className="tune-plays">
              <i className="bi bi-play-circle me-1"></i>
              {tune.play_count || 0}
            </div>
            <div className="tune-size">
              <i className="bi bi-file-earmark me-1"></i>
              {formatFileSize(tune.file_size)}
            </div>
          </div>

          {tune.file_format && (
            <div className="tune-format">
              <Badge bg="outline-primary" text="primary" className="text-uppercase">
                {tune.file_format}
              </Badge>
            </div>
          )}
        </div>
      </Card.Body>

      <style jsx>{`
        .tune-card {
          transition: transform 0.2s, box-shadow 0.2s;
          border: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .tune-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        
        .tune-card-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #f8f9fa;
        }
        
        .tune-card-image {
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        
        .tune-card:hover .tune-card-image {
          transform: scale(1.05);
        }
        
        .tune-card-placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .tune-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .tune-card:hover .tune-card-overlay {
          opacity: 1;
        }
        
        .play-button {
          transform: scale(0.8);
          transition: transform 0.3s;
        }
        
        .tune-card:hover .play-button {
          transform: scale(1);
        }
        
        .tune-favorite-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .tune-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .tune-artist {
          font-size: 0.9rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .tune-album {
          font-size: 0.8rem;
        }
        
        .tune-meta, .tune-stats {
          font-size: 0.75rem;
        }
        
        .tune-stats {
          border-top: 1px solid #e9ecef;
          padding-top: 0.5rem;
        }
        
        .tune-format {
          margin-top: 0.5rem;
        }
      `}</style>
    </Card>
  );
};

export default TuneCard;