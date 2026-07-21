

import React from 'react';
import { Card } from 'react-bootstrap';

const Charts = ({ controller }) => {
  return (
    <Card>
      <Card.Body>
        <h6>Play Trends</h6>
        <div className="chart-placeholder p-4 text-center border rounded">
          <i className="bi bi-bar-chart display-4 text-muted"></i>
          <p className="mt-2">Play count chart visualization</p>
          <small className="text-muted">Chart.js integration coming soon</small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Charts;