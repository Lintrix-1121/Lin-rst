import React from 'react';
import { Button } from 'react-bootstrap';

const StarRating = ({ rating = 0, onRate, readonly = false, size = 'fs-6' }) => {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (value) => {
    if (!readonly && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="d-inline-flex">
      {stars.map((star) => (
        <Button
          key={star}
          variant="link"
          className={`p-0 text-decoration-none ${size}`}
          style={{ color: star <= rating ? '#ffc107' : '#e0e0e0', cursor: readonly ? 'default' : 'pointer' }}
          onClick={() => handleClick(star)}
          disabled={readonly}
        >
          <i className={`bi ${star <= rating ? 'bi-star-fill' : 'bi-star'}`} />
        </Button>
      ))}
    </div>
  );
};

export default StarRating;