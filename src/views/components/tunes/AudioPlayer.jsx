import React, { useRef, useState, useEffect } from 'react';
import { Card, Row, Col, Button, Form, Spinner, Badge } from 'react-bootstrap';
import { tuneAPI } from '../../models/api/tuneAPI';

const AudioPlayer = ({ tune, onEnd, onError, controller }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [objectUrl, setObjectUrl] = useState(null);
  const [playStartTime, setPlayStartTime] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Load audio blob when tune changes
  useEffect(() => {
    if (!tune) {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
      return;
    }

    setLoading(true);
    setError(null);
    setIsPlaying(false);
    setHasStarted(false);

    tuneAPI.streamBlob(tune.id)
      .then(response => {
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        setObjectUrl(url);
        const audio = audioRef.current;
        if (audio) {
          audio.src = url;
          audio.load();
          audio.volume = volume;
          // Auto-play
          audio.play()
            .then(() => {
              setIsPlaying(true);
              setHasStarted(true);
              setPlayStartTime(Date.now());
            })
            .catch(err => setError('Playback failed'));
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        setError('Failed to load audio');
        onError?.(err);
      });

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [tune, onError]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Event listeners
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
      setError('Playback error');
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
  }, [tune, onEnd, onError]);

  // Record skip if user stops before 75% completion
  const recordSkipIfNeeded = async () => {
    if (duration > 0 && currentTime / duration < 0.75 && tune && controller) {
      try {
        await controller.recordSkip(tune.id);
      } catch (err) {
        console.error('Failed to record skip:', err);
      }
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      recordSkipIfNeeded();
    } else {
      audio.play().catch(err => setError('Play failed'));
      if (!hasStarted) {
        setHasStarted(true);
        setPlayStartTime(Date.now());
      }
      setIsPlaying(true);
    }
  };

  // Cleanup skip on unmount or tune change
  useEffect(() => {
    return () => {
      if (isPlaying && duration > 0 && currentTime / duration < 0.75 && tune && controller) {
        controller.recordSkip(tune.id).catch(console.error);
      }
    };
  }, [isPlaying, currentTime, duration, tune, controller]);

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const val = parseFloat(e.target.value);
    const seekTime = (val / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => setVolume(parseFloat(e.target.value));

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
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
                className="play-toggle rounded-circle"
                style={{ width: 38, height: 38 }}
                onClick={togglePlay}
                disabled={loading || !!error}
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
          background: #f8f9fa;
          border-top: 1px solid #dee2e6;
          box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
        }
        .play-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .seek-bar { flex: 1; }
        .time-label { min-width: 40px; font-variant-numeric: tabular-nums; }
        @media (max-width: 576px) {
          .audio-player .card-body { padding: 0.5rem; }
          .time-label { min-width: 30px; font-size: 0.7rem; }
        }
      `}</style>
    </Card>
  );
};

export default AudioPlayer;

