import React, { useState, useEffect } from 'react';
import { 
  Modal, Form, Button, Row, Col, Alert, 
  Spinner, Badge, Card 
} from 'react-bootstrap';

const TuneEditor = ({ show, tune, onClose, onSave, tuneController }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    album_artist: '',
    genre: '',
    year: '',
    track_number: '',
    disk_number: '',
    composer: '',
    rating: '',
    favorite: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tune) {
      // Editing existing tune
      setFormData({
        title: tune.title || '',
        artist: tune.artist || '',
        album: tune.album || '',
        album_artist: tune.album_artist || '',
        genre: tune.genre || '',
        year: tune.year || '',
        track_number: tune.track_number || '',
        disk_number: tune.disk_number || '',
        composer: tune.composer || '',
        rating: tune.rating || '',
        favorite: tune.favorite || false
      });
    } else {
      // Creating new tune
      setFormData({
        title: '',
        artist: '',
        album: '',
        album_artist: '',
        genre: '',
        year: '',
        track_number: '',
        disk_number: '',
        composer: '',
        rating: '',
        favorite: false
      });
    }
    setError(null);
  }, [tune, show]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        year: formData.year ? parseInt(formData.year) : null,
        track_number: formData.track_number ? parseInt(formData.track_number) : null,
        disk_number: formData.disk_number ? parseInt(formData.disk_number) : null,
        rating: formData.rating ? parseFloat(formData.rating) : null
      };

      if (tune) {
        // Update existing tune
        await tuneController.updateTune(tune.id, submitData);
      } else {
        // Create new tune
        await tuneController.createTune(submitData);
      }

      onSave();
    } catch (err) {
      console.error('Error saving tune:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="h5 mb-0">
          <i className={`bi ${tune ? 'bi-pencil-square' : 'bi-plus-circle'} text-primary me-2`}></i>
          {tune ? 'Edit Tune' : 'Add New Tune'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          {error && (
            <Alert variant="danger" className="mb-4">
              <div className="d-flex align-items-center">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <span>{error}</span>
              </div>
            </Alert>
          )}

          <Row className="g-3">
            {/* Required Fields */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Title <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter song title"
                  className="border-secondary"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Artist <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="artist"
                  value={formData.artist}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter artist name"
                  className="border-secondary"
                />
              </Form.Group>
            </Col>

            {/* Album Information */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Album</Form.Label>
                <Form.Control
                  type="text"
                  name="album"
                  value={formData.album}
                  onChange={handleInputChange}
                  placeholder="Enter album name"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Album Artist</Form.Label>
                <Form.Control
                  type="text"
                  name="album_artist"
                  value={formData.album_artist}
                  onChange={handleInputChange}
                  placeholder="Enter album artist"
                />
              </Form.Group>
            </Col>

            {/* Genre and Year */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Genre</Form.Label>
                <Form.Control
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  placeholder="e.g., Rock, Jazz, Electronic"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                >
                  <option value="">Select year</option>
                  {yearOptions.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Track Details */}
            <Col md={4}>
              <Form.Group>
                <Form.Label>Track Number</Form.Label>
                <Form.Control
                  type="number"
                  name="track_number"
                  value={formData.track_number}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="1"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Disk Number</Form.Label>
                <Form.Control
                  type="number"
                  name="disk_number"
                  value={formData.disk_number}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="1"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Composer</Form.Label>
                <Form.Control
                  type="text"
                  name="composer"
                  value={formData.composer}
                  onChange={handleInputChange}
                  placeholder="Enter composer"
                />
              </Form.Group>
            </Col>

            {/* Rating and Favorite */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                >
                  <option value="">No rating</option>
                  <option value="1">★☆☆☆☆ (1)</option>
                  <option value="2">★★☆☆☆ (2)</option>
                  <option value="3">★★★☆☆ (3)</option>
                  <option value="4">★★★★☆ (4)</option>
                  <option value="5">★★★★★ (5)</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="h-100 d-flex align-items-end">
                <Form.Check
                  type="checkbox"
                  name="favorite"
                  label={
                    <span className="fw-semibold">
                      <i className="bi bi-heart text-danger me-1"></i>
                      Add to favorites
                    </span>
                  }
                  checked={formData.favorite}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* File Information (for existing tunes) */}
          {tune && (
            <Card className="mt-4 border-light bg-light">
              <Card.Body>
                <h6 className="mb-3 fw-semibold text-muted">
                  <i className="bi bi-info-circle text-primary me-2"></i>
                  File Information
                </h6>
                <Row className="g-3 text-muted small">
                  <Col sm={6} md={4}>
                    <div className="d-flex justify-content-between">
                      <span>Format:</span>
                      <Badge bg="dark" className="text-uppercase">
                        {tune.file_format || 'N/A'}
                      </Badge>
                    </div>
                  </Col>
                  <Col sm={6} md={4}>
                    <div className="d-flex justify-content-between">
                      <span>Size:</span>
                      <span>{formatFileSize(tune.file_size)}</span>
                    </div>
                  </Col>
                  <Col sm={6} md={4}>
                    <div className="d-flex justify-content-between">
                      <span>Duration:</span>
                      <span>{formatDuration(tune.duration)}</span>
                    </div>
                  </Col>
                  <Col sm={6} md={4}>
                    <div className="d-flex justify-content-between">
                      <span>Plays:</span>
                      <Badge bg="success">{tune.play_count || 0}</Badge>
                    </div>
                  </Col>
                  <Col sm={6} md={4}>
                    <div className="d-flex justify-content-between">
                      <span>Bitrate:</span>
                      <span>{tune.bitrate ? `${tune.bitrate} kbps` : 'N/A'}</span>
                    </div>
                  </Col>
                  <Col sm={6} md={4}>
                    <div className="d-flex justify-content-between">
                      <span>Sample Rate:</span>
                      <span>{tune.sample_rate ? `${tune.sample_rate} Hz` : 'N/A'}</span>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>

        <Modal.Footer className="bg-light">
          <Button 
            variant="outline-secondary" 
            onClick={onClose} 
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
            className="d-flex align-items-center"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                {tune ? 'Update Tune' : 'Create Tune'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TuneEditor;



