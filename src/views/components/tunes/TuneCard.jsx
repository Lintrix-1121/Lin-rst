import { controllers } from 'chart.js';
import React, { useState } from 'react';
import {
  Card, Button, Badge, Dropdown, Form, Modal,
  OverlayTrigger, Tooltip
} from 'react-bootstrap';
import Rating from 'react-rating';

const TuneCard = ({
  tune,
  onEdit,
  onDelete,
  onPlay,
  onDownload,
  onToggleFavorite,
  onUpdateRating,
  isSelected,
  onSelect,
  controller
}) => {
  const [imageError, setImageError] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Helper functions
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
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

  return (
    <>
      <Card className={`h-100 tune-card ${isSelected ? 'border-primary border-2' : ''}`}>
        {/* Selection checkbox */}
        <div className="position-absolute top-0 start-0 m-2 z-1">
          <Form.Check
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Image / Placeholder with overlay */}
        <div className="tune-card-image-container">
          {tune.cover_art_url && !imageError ? (
            <Card.Img
              variant="top"
              src={tune.cover_art_url}
              alt={tune.title}
              onError={() => setImageError(true)}
              className="tune-card-image"
            />
          ) : (
            <div className="tune-card-placeholder">
              <i className="bi bi-music-note-beamed display-4" />
            </div>
          )}
          <div className="tune-card-overlay">
            <Button
              variant="primary"
              size="sm"
              className="play-button rounded-circle"
              onClick={onPlay}
            >
              <i className="bi bi-play-fill fs-4" />
            </Button>
          </div>
          {/* Favorite Toggle Button (interactive) */}
          <Button
            variant={tune.favorite ? 'danger' : 'outline-danger'}
            size="sm"
            className="favorite-toggle position-absolute top-0 end-0 m-2 rounded-circle"
            style={{ width: 36, height: 36 }}
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          >
            <i className={tune.favorite ? 'bi bi-heart-fill' : 'bi bi-heart'} />
          </Button>
        </div>

        <Card.Body className="d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-1">
            <Card.Title className="tune-title text-truncate" title={tune.title}>
              {tune.title}
            </Card.Title>
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" size="sm" />
              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => onEdit(tune)}>
                  <i className="bi bi-pencil me-2" /> Edit
                </Dropdown.Item>
                <Dropdown.Item onClick={onPlay}>
                  <i className="bi bi-play me-2" /> Play
                </Dropdown.Item>
                <Dropdown.Item onClick={onDownload}>
                  <i className="bi bi-download me-2" /> Download
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setShowStatsModal(true)}>
                  <i className="bi bi-bar-chart me-2" /> Stats
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => onDelete(tune.id)} className="text-danger">
                  <i className="bi bi-trash me-2" /> Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <Card.Text className="tune-artist text-muted text-truncate" title={tune.artist}>
            {tune.artist}
          </Card.Text>

          {tune.album && (
            <Card.Text className="tune-album small text-muted text-truncate" title={tune.album}>
              <i className="bi bi-disc me-1" /> {tune.album}
            </Card.Text>
          )}

          {/* Rating Stars */}
          {/* <div className="mb-2">
            <Rating
              initialRating={tune.rating || 0}
              emptySymbol="bi bi-star text-muted"
              fullSymbol="bi bi-star-fill text-warning"
              onClick={(rate) => onUpdateRating(rate)}
              stop={5}
              readonly={false}
              className="fs-6"
            />
            <span className="ms-2 small text-muted">({tune.rating || 0})</span>
          </div> */}

          <div className="mb-2">
            <StarRating
              rating={tune.rating || 0}
              onRate={(newRating) => onUpdateRating(newRating)}
              size="fs-6"
            />
            <span className="ms-2 small text-muted">({tune.rating || 0})</span>
          </div>

          <div className="mt-auto">
            <div className="d-flex flex-wrap gap-1 mb-2">
              {tune.genre && <Badge bg="secondary">{tune.genre}</Badge>}
              {tune.year && <Badge bg="light" text="dark">{tune.year}</Badge>}
              {getQualityBadge(tune.bitrate)}
              {tune.file_format && (
                <Badge bg="outline-primary" text="primary" className="text-uppercase">
                  {tune.file_format}
                </Badge>
              )}
            </div>

            <div className="d-flex justify-content-between align-items-center tune-stats">
              <div><i className="bi bi-clock me-1" /> {formatDuration(tune.duration)}</div>
              <div><i className="bi bi-play-circle me-1" /> {tune.play_count || 0}</div>
              <div><i className="bi bi-skip-forward me-1" /> {tune.skip_count || 0}</div>
            </div>
            <div className="d-flex justify-content-between mt-1 small text-muted">
              <span><i className="bi bi-file-earmark me-1" /> {formatFileSize(tune.file_size)}</span>
              <span>Added: {new Date(tune.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Stats Modal for detailed analytics */}
      <Modal show={showStatsModal} onHide={() => setShowStatsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-bar-chart me-2" />
            Statistics for "{tune.title}"
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TuneStats tuneId={tune.id} controller={controller} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TuneCard;