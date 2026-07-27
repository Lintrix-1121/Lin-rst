
import React from 'react';
import { Card } from 'react-bootstrap';
import PlayHistoryChart from './PlayHistoryChart';

const Charts = ({ chartData, timeRange }) => {
  return (
    <Card>
      <Card.Body>
        <h6>Play Trends</h6>
        <PlayHistoryChart chartData={chartData} timeRange={timeRange} />
      </Card.Body>
    </Card>
  );
};

export default Charts;