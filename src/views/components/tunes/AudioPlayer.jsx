import React, { useRef, useState, useEffect } from 'react';
import { Card, Row, Col, Button, Form, Spinner, Badge } from 'react-bootstrap';
import { tuneAPI } from '../../../models/api/tuneAPI'; 

const AudioPlayer = ({ tune, onEnd, onError }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    if (!tune) {
      // Cleanup when no tune is set
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setObjectUrl(null);
      }
      return;
    }

    setLoading(true);
    setError(null);
    setIsPlaying(false);

    // Fetch the audio as a blob
    tuneAPI.streamBlob(tune.id)
      .then(response => {
        // Assuming ApiService returns the raw response with blob data
        // If using axios, response.data is the Blob
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        setObjectUrl(url);

        const audio = audioRef.current;
        if (!audio) return;

        audio.src = url;
        audio.load();
        audio.volume = volume;

        // Auto-play after load
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            setError('Playback failed.');
            onError?.(err);
          });
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        setError('Failed to load audio.');
        onError?.(err);
      });

    // Cleanup on unmount or tune change
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setObjectUrl(null);
      }
    };
  }, [tune, onError, volume]); // Re-fetch when tune changes

  // Effect to handle volume changes without re-fetching
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Event listeners for playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onEnd?.();
    };
    const handleError = (e) => {
      setError('Playback error.');
      onError?.(e);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [tune, onEnd, onError]); // Re-attach when tune changes

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(err => {
        setError('Play failed.');
      });
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const seekTime = (e.target.value / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!tune) return null;

  return (
    <Card className="audio-player shadow-sm">
      <audio ref={audioRef} preload="metadata" />
      <Card.Body>
        <Row className="align-items-center">
          <Col xs={12} md={4} className="d-flex align-items-center mb-2 mb-md-0">
            <div className="track-info flex-grow-1">
              <h6 className="mb-0 text-truncate" title={tune.title}>{tune.title}</h6>
              <small className="text-muted text-truncate d-block" title={tune.artist}>{tune.artist}</small>
            </div>
            {loading && <Spinner animation="border" size="sm" className="ms-2" />}
            {error && <Badge bg="danger" className="ms-2">Error</Badge>}
          </Col>
          <Col xs={12} md={8}>
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={togglePlay}
                disabled={loading || !!error}
                className="play-toggle"
              >
                {isPlaying ? <i className="bi bi-pause-fill" /> : <i className="bi bi-play-fill" />}
              </Button>
              <div className="flex-grow-1 d-flex align-items-center gap-2">
                <span className="time-label small">{formatTime(currentTime)}</span>
                <Form.Range
                  min="0"
                  max="100"
                  value={duration ? (currentTime / duration) * 100 : 0}
                  onChange={handleSeek}
                  disabled={loading || !!error || !duration}
                  className="seek-bar"
                />
                <span className="time-label small">{formatTime(duration)}</span>
              </div>
              <div className="volume-control d-none d-sm-flex align-items-center gap-1">
                <i className="bi bi-volume-up" />
                <Form.Range
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                  style={{ width: '60px' }}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
      <style jsx>{`
        .audio-player {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1050;
          border-radius: 0;
          margin: 0;
          background: #f8f9fa;
          border-top: 1px solid #dee2e6;
          box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
        }
        .play-toggle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .seek-bar { flex: 1; }
        .time-label { min-width: 40px; font-variant-numeric: tabular-nums; }
        .track-info { min-width: 120px; }
        @media (max-width: 576px) {
          .audio-player .card-body { padding: 0.5rem; }
          .track-info h6 { font-size: 0.9rem; }
          .time-label { min-width: 30px; font-size: 0.7rem; }
        }
      `}</style>
    </Card>
  );
};

export default AudioPlayer;