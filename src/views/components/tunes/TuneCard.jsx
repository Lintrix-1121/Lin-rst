// // src/components/Tune/TuneCard.jsx
// import React, { useState } from 'react';
// import { Card, Button, Badge, Dropdown, Stack } from 'react-bootstrap';

// const TuneCard = ({ tune, onEdit, onDelete, onPlay }) => {
//   const [imageError, setImageError] = useState(false);

//   const formatDuration = (seconds) => {
//     if (!seconds) return '0:00';
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const formatFileSize = (bytes) => {
//     if (!bytes) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   const getQualityBadge = (bitrate) => {
//     if (!bitrate) return null;
//     if (bitrate >= 320) return <Badge bg="success">HQ</Badge>;
//     if (bitrate >= 192) return <Badge bg="primary">Good</Badge>;
//     return <Badge bg="secondary">Standard</Badge>;
//   };

//   const getRatingStars = (rating) => {
//     if (!rating) return null;
//     return (
//       <div className="d-flex align-items-center">
//         <i className="bi bi-star-fill text-warning small"></i>
//         <small className="ms-1">{rating}</small>
//       </div>
//     );
//   };

//   return (
//     <Card className="h-100 shadow-sm hover-shadow transition-all">
//       {/* Image Section */}
//       <div className="position-relative" style={{ height: '160px', overflow: 'hidden' }}>
//         {tune.cover_art_url && !imageError ? (
//           <Card.Img
//             variant="top"
//             src={tune.cover_art_url}
//             alt={`${tune.title} cover`}
//             onError={() => setImageError(true)}
//             style={{ 
//               height: '100%', 
//               objectFit: 'cover',
//               transition: 'transform 0.3s ease'
//             }}
//             className="card-img-hover"
//           />
//         ) : (
//           <div 
//             className="w-100 h-100 d-flex align-items-center justify-content-center"
//             style={{ 
//               background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//             }}
//           >
//             <i className="bi bi-music-note-beamed display-6 text-white"></i>
//           </div>
//         )}
        
//         {/* Overlay with Play Button */}
//         <div 
//           className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//           style={{ 
//             backgroundColor: 'rgba(0,0,0,0.3)',
//             opacity: 0,
//             transition: 'opacity 0.3s ease'
//           }}
//           onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
//           onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
//         >
//           <Button
//             variant="primary"
//             size="sm"
//             onClick={onPlay}
//             className="rounded-circle"
//             style={{ width: '50px', height: '50px' }}
//           >
//             <i className="bi bi-play-fill fs-6"></i>
//           </Button>
//         </div>

//         {/* Favorite Badge */}
//         {tune.favorite && (
//           <div 
//             className="position-absolute top-0 end-0 m-2 bg-white rounded-circle d-flex align-items-center justify-content-center"
//             style={{ width: '30px', height: '30px' }}
//           >
//             <i className="bi bi-heart-fill text-danger"></i>
//           </div>
//         )}

//         {/* Format Badge */}
//         {tune.file_format && (
//           <Badge 
//             bg="dark" 
//             className="position-absolute bottom-0 end-0 m-2 text-uppercase"
//           >
//             {tune.file_format}
//           </Badge>
//         )}
//       </div>

//       <Card.Body className="d-flex flex-column">
//         {/* Header with Title and Actions */}
//         <div className="d-flex justify-content-between align-items-start mb-2">
//           <Card.Title 
//             className="h6 mb-0 text-truncate flex-grow-1 me-2"
//             title={tune.title}
//           >
//             {tune.title}
//           </Card.Title>
//           <Dropdown>
//             <Dropdown.Toggle 
//               variant="outline-secondary" 
//               size="sm" 
//               className="border-0"
//             >
//               <i className="bi bi-three-dots-vertical"></i>
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               <Dropdown.Item onClick={() => onEdit(tune)}>
//                 <i className="bi bi-pencil me-2"></i>
//                 Edit
//               </Dropdown.Item>
//               <Dropdown.Item onClick={onPlay}>
//                 <i className="bi bi-play me-2"></i>
//                 Play
//               </Dropdown.Item>
//               <Dropdown.Divider />
//               <Dropdown.Item 
//                 onClick={() => onDelete(tune.id)}
//                 className="text-danger"
//               >
//                 <i className="bi bi-trash me-2"></i>
//                 Delete
//               </Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>
//         </div>

//         {/* Artist */}
//         <Card.Text 
//           className="text-muted small text-truncate mb-2"
//           title={tune.artist}
//         >
//           {tune.artist}
//         </Card.Text>

//         {/* Album */}
//         {tune.album && (
//           <Card.Text 
//             className="small text-muted text-truncate mb-2"
//             title={tune.album}
//           >
//             <i className="bi bi-disc me-1"></i>
//             {tune.album}
//           </Card.Text>
//         )}

//         {/* Metadata */}
//         <Stack gap={1} className="mb-2">
//           <div className="d-flex justify-content-between small text-muted">
//             {tune.year && <span>{tune.year}</span>}
//             {tune.genre && (
//               <Badge bg="outline-secondary" text="dark" className="ms-2">
//                 {tune.genre}
//               </Badge>
//             )}
//           </div>
//           {getQualityBadge(tune.bitrate)}
//         </Stack>

//         {/* Stats */}
//         <div className="mt-auto pt-2 border-top">
//           <div className="d-flex justify-content-between align-items-center small text-muted">
//             <div className="d-flex gap-3">
//               <span title="Duration">
//                 <i className="bi bi-clock me-1"></i>
//                 {formatDuration(tune.duration)}
//               </span>
//               <span title="Play count">
//                 <i className="bi bi-play-circle me-1"></i>
//                 {tune.play_count || 0}
//               </span>
//             </div>
//             {getRatingStars(tune.rating)}
//           </div>
//         </div>
//       </Card.Body>

//       {/* Hover effect styles */}
//       <style>{`
//         .hover-shadow:hover {
//           box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
//           transform: translateY(-2px);
//         }
//         .transition-all {
//           transition: all 0.3s ease;
//         }
//         .card-img-hover {
//           transition: transform 0.3s ease;
//         }
//         .hover-shadow:hover .card-img-hover {
//           transform: scale(1.05);
//         }
//       `}</style>
//     </Card>
//   );
// };

// export default TuneCard;









// src/components/Tune/TuneCard.jsx
import React, { useState } from 'react';
import { Card, Button, Badge, Dropdown } from 'react-bootstrap';

const TuneCard = ({ tune, onEdit, onDelete, onPlay }) => {
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