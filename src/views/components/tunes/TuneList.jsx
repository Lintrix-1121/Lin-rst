import React, { useState, useEffect, useCallback } from 'react';
import {
  Row, Col, Card, Button, Form, InputGroup,
  Spinner, Alert, Badge, Container, Modal
} from 'react-bootstrap';
import toast from 'react-hot-toast';
import TuneCard from './TuneCard';
import TuneEditor from './TuneEditor';
import AudioPlayer from './AudioPlayer';

const TuneList = ({ controller, onTunesLoaded }) => {
  // State
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
  const [currentPlayingTune, setCurrentPlayingTune] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewFilter, setViewFilter] = useState('all'); // 'all' | 'favorites' | 'mostPlayed' | 'recent'
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Load tunes based on filter
  const loadTunes = useCallback(async () => {
      if (!controller) {
      setError('Controller not available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      let data;
      switch (viewFilter) {
        case 'favorites':
          data = await controller.getFavorites();
          break;
        case 'mostPlayed':
          data = await controller.getMostPlayed({ limit: 1000 });
          break;
        case 'recent':
          data = await controller.getRecentTunes({ limit: 1000 });
          break;
        default:
          data = await controller.loadTunes({ limit: 1000 });
      }
      setTunes(Array.isArray(data) ? data : []);
      setSelectedIds([]); // clear selection on filter change
       if (onTunesLoaded) {
        const fullList = viewFilter === 'all' ? data : await controller.loadTunes({ limit: 1000 });
        onTunesLoaded(fullList);
      }
    } catch (err) {
      console.error('Error loading tunes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [controller, viewFilter, onTunesLoaded]);

  useEffect(() => {
    loadTunes();
  }, [loadTunes]);

  // Filter & sort client-side
  useEffect(() => {
    let filtered = tunes;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        (t.title?.toLowerCase().includes(q)) ||
        (t.artist?.toLowerCase().includes(q)) ||
        (t.album?.toLowerCase().includes(q)) ||
        (t.genre?.toLowerCase().includes(q))
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let aVal = a[sortBy] ?? '';
      let bVal = b[sortBy] ?? '';
      if (['year', 'play_count', 'duration', 'rating', 'track_number', 'disk_number'].includes(sortBy)) {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      }
      if (sortOrder === 'desc') [aVal, bVal] = [bVal, aVal];
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    });

    setFilteredTunes(filtered);
    setCurrentPage(1);
  }, [tunes, searchQuery, sortBy, sortOrder]);

  // Handlers
  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleSortChange = (field) => {
    if (sortBy === field) setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
  };

  const handleEditTune = (tune) => {
    setSelectedTune(tune);
    setShowEditor(true);
  };

  const handleDeleteTune = async (id) => {
    if (!window.confirm('Delete this tune?')) return;
    try {
      await controller.deleteTune(id);
      toast.success('Tune deleted');
      await loadTunes();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await controller.deleteMultipleTunes(selectedIds);
      toast.success(`${selectedIds.length} tunes deleted`);
      setSelectedIds([]);
      await loadTunes();
    } catch (err) {
      toast.error(err.message);
    }
    setShowBulkDeleteConfirm(false);
  };

  const handlePlayTune = async (tune) => {
    setCurrentPlayingTune(tune);
    try {
      await controller.recordPlay(tune.id);
      // Refresh to update play count
      await loadTunes();
    } catch (err) {
      console.error('Failed to record play:', err);
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      await controller.toggleFavorite(id);
      await loadTunes();
    } catch (err) {
      toast.error('Failed to toggle favorite');
    }
  };

  const handleUpdateRating = async (id, rating) => {
    try {
      await controller.updateRating(id, rating);
      await loadTunes();
    } catch (err) {
      toast.error('Failed to update rating');
    }
  };


    const handleDownloadTune = async (tune) => {
    const toastId = toast.loading(`Preparing ${tune.title}...`);
    try {
      const blob = await controller.downloadTune(tune.id); // assumes controller has this method
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${tune.artist} - ${tune.title}.${tune.file_format || 'mp3'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      toast.success(`Downloaded ${tune.title}`, { id: toastId });
    } catch (err) {
      toast.error('Download failed', { id: toastId });
    }
  };

  // Helper to fetch blob if controller lacks downloadTune
  const fetchDownload = async (id) => {
    const response = await fetch(`/api/dold/download/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    });
    if (!response.ok) throw new Error('Download failed');
    return response.blob();
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedTunes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedTunes.map(t => t.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Pagination
  const totalPages = Math.ceil(filteredTunes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTunes = filteredTunes.slice(startIndex, startIndex + itemsPerPage);

  // Loading & error states
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <div className="mt-2">Loading library...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        <i className="bi bi-exclamation-triangle me-2" />
        {error}
        <Button variant="outline-danger" size="sm" className="ms-3" onClick={loadTunes}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <>
      <div className="p-3">
        {/* Header with Add button */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-0">
              <i className="bi bi-music-note-beamed me-2" />
              {filteredTunes.length} of {tunes.length} tracks
              {searchQuery && ` matching "${searchQuery}"`}
            </h5>
          </div>
          <Button variant="primary" onClick={() => { setSelectedTune(null); setShowEditor(true); }}>
            <i className="bi bi-plus-circle me-2" />
            Add Tune
          </Button>
        </div>

        {/* Quick Filter Buttons */}
        <div className="mb-3 d-flex flex-wrap gap-2">
          {['all', 'favorites', 'mostPlayed', 'recent'].map((filter) => (
            <Button
              key={filter}
              variant={viewFilter === filter ? 'primary' : 'outline-secondary'}
              size="sm"
              onClick={() => setViewFilter(filter)}
            >
              {filter === 'all' && <i className="bi bi-grid me-1" />}
              {filter === 'favorites' && <i className="bi bi-heart-fill text-danger me-1" />}
              {filter === 'mostPlayed' && <i className="bi bi-graph-up me-1" />}
              {filter === 'recent' && <i className="bi bi-clock-history me-1" />}
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>

        {/* Search & Sort Bar */}
        <Card className="shadow-sm mb-3">
          <Card.Body className="p-2">
            <Row className="g-2 align-items-center">
              <Col lg={6} md={7}>
                <InputGroup size="sm">
                  <InputGroup.Text><i className="bi bi-search" /></InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by title, artist, album, genre..."
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  {searchQuery && (
                    <Button variant="outline-secondary" onClick={() => setSearchQuery('')}>
                      <i className="bi bi-x" />
                    </Button>
                  )}
                </InputGroup>
              </Col>
              <Col lg={3} md={3}>
                <Form.Select
                  size="sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
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
                  size="sm"
                  variant={sortOrder === 'asc' ? 'outline-primary' : 'outline-secondary'}
                  onClick={() => handleSortChange(sortBy)}
                  className="w-100"
                >
                  <i className={`bi ${sortOrder === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down'} me-1`} />
                  {sortOrder === 'asc' ? 'Asc' : 'Desc'}
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="d-flex align-items-center gap-2 mb-3 p-2 bg-light rounded">
            <span className="text-muted">{selectedIds.length} selected</span>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setSelectedIds([])}
            >
              Clear
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowBulkDeleteConfirm(true)}
            >
              <i className="bi bi-trash me-1" />
              Delete Selected
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedIds.length === paginatedTunes.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        )}

        {/* Tune Grid */}
        {filteredTunes.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <i className="bi bi-music-note-beamed display-4 text-muted" />
              <h5 className="mt-3">No tunes found</h5>
              <p className="text-muted">
                {searchQuery ? 'Try adjusting your search' : 'Add your first tune'}
              </p>
              {!searchQuery && (
                <Button variant="primary" onClick={() => { setSelectedTune(null); setShowEditor(true); }}>
                  <i className="bi bi-plus-circle me-2" />
                  Add Tune
                </Button>
              )}
            </Card.Body>
          </Card>
        ) : (
          <>
            <Row>
              {paginatedTunes.map(tune => (
                <Col key={tune.id} xl={3} lg={4} md={6} className="mb-3">
                  <TuneCard
                    tune={tune}
                    onEdit={handleEditTune}
                    onDelete={handleDeleteTune}
                    onPlay={() => handlePlayTune(tune)}
                    onDownload={() => handleDownloadTune(tune)}
                    onToggleFavorite={() => handleToggleFavorite(tune.id)}
                    onUpdateRating={(rating) => handleUpdateRating(tune.id, rating)}
                    isSelected={selectedIds.includes(tune.id)}
                    onSelect={() => toggleSelect(tune.id)}
                    controller={controller}
                  />
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <div className="btn-group">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    <i className="bi bi-chevron-left" />
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    <i className="bi bi-chevron-right" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Tune Editor Modal */}
      <TuneEditor
        show={showEditor}
        tune={selectedTune}
        onClose={() => setShowEditor(false)}
        onSave={() => { loadTunes(); setShowEditor(false); }}
        controller={controller}
      />

      {/* Bulk Delete Confirmation */}
      <Modal show={showBulkDeleteConfirm} onHide={() => setShowBulkDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Bulk Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedIds.length}</strong> selected tunes?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBulkDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleBulkDelete}>
            Delete All
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Audio Player */}
      <AudioPlayer
        tune={currentPlayingTune}
        onEnd={() => setCurrentPlayingTune(null)}
        onError={() => setCurrentPlayingTune(null)}
        controller={controller}
      />
    </>
  );
};

export default TuneList;