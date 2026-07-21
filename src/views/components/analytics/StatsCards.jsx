import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const StatsCards = ({ stats }) => {
  const statItems = [
    { title: 'Total Plays', value: stats?.totalPlays || '0', icon: 'bi-play-circle', color: 'primary' },
    { title: 'Downloads', value: stats?.downloads || '0', icon: 'bi-download', color: 'success' },
    { title: 'Active Users', value: stats?.activeUsers || '0', icon: 'bi-people', color: 'info' },
    { title: 'Revenue', value: stats?.revenue || '$0', icon: 'bi-currency-dollar', color: 'warning' },
  ];

  return (
    <Row>
      {statItems.map((stat, index) => (
        <Col lg={3} md={6} key={index} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">{stat.title}</h6>
                  <h3 className={`text-${stat.color}`}>{stat.value}</h3>
                </div>
                <div className="stat-icon">
                  <i className={`${stat.icon} display-4 text-muted`}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCards;