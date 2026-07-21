// src/components/Tune/TuneList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Row, Col, Card, Button, Form, InputGroup, 
  Spinner, Alert, Badge, Container 
} from 'react-bootstrap';
import TuneController from '../../../controllers/TuneController';
import TuneCard from './TuneCard';
import TuneEditor from './TuneEditor';

const TuneList = () => {
  const [tuneController] = useState(() => new TuneController());
  const [tunes, setTunes] = useState([]);
  const [filteredTunes, setFilteredTunes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTune, setSelectedTune] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    loadTunes();
  }, []);

  useEffect(() => {
    filterAndSortTunes();
  }, [tunes, searchQuery, sortBy, sortOrder, currentPage]);

  const loadTunes = async () => {
    try {
      setLoading(true);
      setError(null);
      const tunesData = await tuneController.loadTunes({ limit: 1000 });
      setTunes(Array.isArray(tunesData) ? tunesData : []);
    } catch (err) {
      console.error('Error loading tunes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTunes = useCallback(() => {
    let filtered = tunes;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = tunes.filter(tune =>
        (tune.title && tune.title.toLowerCase().includes(query)) ||
        (tune.artist && tune.artist.toLowerCase().includes(query)) ||
        (tune.album && tune.album.toLowerCase().includes(query)) ||
        (tune.genre && tune.genre.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let aVal = a[sortBy] || '';
      let bVal = b[sortBy] || '';

      // Handle numeric fields differently
      if (['year', 'play_count', 'duration', 'rating', 'track_number', 'disk_number'].includes(sortBy)) {
        aVal = aVal || 0;
        bVal = bVal || 0;
      }

      if (sortOrder === 'desc') {
        [aVal, bVal] = [bVal, aVal];
      }

      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
      return 0;
    });

    setFilteredTunes(filtered);
  }, [tunes, searchQuery, sortBy, sortOrder]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleEditTune = (tune) => {
    setSelectedTune(tune);
    setShowEditor(true);
  };

  const handleDeleteTune = async (tuneId) => {
    if (window.confirm('Are you sure you want to delete this tune?')) {
      try {
        await tuneController.deleteTune(tuneId);
        await loadTunes(); // Reload the list
      } catch (err) {
        console.error('Error deleting tune:', err);
        setError(err.message);
      }
    }
  };

  const handlePlayTune = async (tuneId) => {
    try {
      await tuneController.recordPlay(tuneId);
      // Optional: Refresh the list to update play counts
      await loadTunes();
    } catch (err) {
      console.error('Error recording play:', err);
    }
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setSelectedTune(null);
  };

  const handleEditorSave = async () => {
    await loadTunes(); // Reload the list after save
    setShowEditor(false);
    setSelectedTune(null);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return 'bi-arrow-down-up';
    return sortOrder === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  };

  // Pagination
  const totalPages = Math.ceil(filteredTunes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTunes = filteredTunes.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <div>Loading your music library...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          {/* <h1 className="h2 mb-1">
            <i className="bi bi-music-note-list text-primary me-2"></i>
            Music Library
          </h1> */}
          <p className="text-muted mb-0">
            {filteredTunes.length} of {tunes.length} tunes
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowEditor(true)}
          className="d-flex align-items-center"
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Tune
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card className="shadow-sm mb-4">
        <Card.Body className="p-3">
          <Row className="g-2 align-items-center">
            <Col lg={6} md={8}>
              <InputGroup>
                <InputGroup.Text className="bg-light">
                  <i className="bi bi-search text-muted"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by title, artist, album, or genre..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="border-start-0"
                />
                {searchQuery && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => setSearchQuery('')}
                  >
                    <i className="bi bi-x"></i>
                  </Button>
                )}
              </InputGroup>
            </Col>
            <Col lg={3} md={2}>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                size="sm"
              >
                <option value="title">Title</option>
                <option value="artist">Artist</option>
                <option value="album">Album</option>
                <option value="year">Year</option>
                <option value="play_count">Plays</option>
                <option value="duration">Duration</option>
                <option value="rating">Rating</option>
              </Form.Select>
            </Col>
            <Col lg={3} md={2}>
              <Button
                variant={sortOrder === 'asc' ? 'outline-primary' : 'outline-secondary'}
                onClick={() => handleSortChange(sortBy)}
                className="w-100 d-flex align-items-center justify-content-center"
                size="sm"
              >
                <i className={`bi ${getSortIcon(sortBy)} me-2`}></i>
                {sortOrder === 'asc' ? 'Asc' : 'Desc'}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" className="mb-4">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <div className="flex-grow-1">{error}</div>
            <Button variant="outline-danger" size="sm" onClick={loadTunes}>
              Retry
            </Button>
          </div>
        </Alert>
      )}

      {/* Quick Stats */}
      {tunes.length > 0 && (
        <Row className="mb-4">
          <Col xs={6} sm={4} md={2}>
            <Card className="text-center bg-light">
              <Card.Body className="py-2">
                <div className="h6 mb-0 text-muted">Total</div>
                <div className="h4 mb-0 text-primary">{tunes.length}</div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} sm={4} md={2}>
            <Card className="text-center bg-light">
              <Card.Body className="py-2">
                <div className="h6 mb-0 text-muted">Favorites</div>
                <div className="h4 mb-0 text-warning">
                  {tunes.filter(t => t.favorite).length}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} sm={4} md={2}>
            <Card className="text-center bg-light">
              <Card.Body className="py-2">
                <div className="h6 mb-0 text-muted">Total Plays</div>
                <div className="h4 mb-0 text-success">
                  {tunes.reduce((sum, t) => sum + (t.play_count || 0), 0)}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Tunes Grid */}
      {filteredTunes.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <i className="bi bi-music-note-beamed display-4 text-muted mb-3"></i>
            <h4 className="text-muted">
              {searchQuery ? 'No tunes found' : 'No tunes yet'}
            </h4>
            <p className="text-muted mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Get started by adding your first tune'}
            </p>
            {!searchQuery && (
              <Button variant="primary" onClick={() => setShowEditor(true)}>
                <i className="bi bi-plus-circle me-2"></i>
                Add Your First Tune
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <>
          <Row>
            {paginatedTunes.map(tune => (
              <Col key={tune.id} xl={3} lg={4} md={6} className="mb-4">
                <TuneCard
                  tune={tune}
                  onEdit={handleEditTune}
                  onDelete={handleDeleteTune}
                  onPlay={() => handlePlayTune(tune.id)}
                />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <div className="btn-group">
                <Button
                  variant="outline-primary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <i className="bi bi-chevron-left"></i>
                </Button>
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index + 1}
                    variant={currentPage === index + 1 ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  variant="outline-primary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <i className="bi bi-chevron-right"></i>
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Tune Editor Modal */}
      <TuneEditor
        show={showEditor}
        tune={selectedTune}
        onClose={handleEditorClose}
        onSave={handleEditorSave}
        tuneController={tuneController}
      />
    </Container>
  );
};

export default TuneList;


