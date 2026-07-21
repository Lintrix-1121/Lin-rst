import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import TuneList from '../components/tunes/TuneList';

const TuneManagerPage = () => {
  return (
    <div className="section-container">
      <div className="section-header">
        <h2><i className="bi bi-music-note-list me-2"></i>Tune Manager</h2>
        <p className="text-muted">Manage your tune library</p>
      </div>

      <Row>
        <Col>
          <Card>

            <TuneList />
            <Card.Body className="text-center py-5">
              <i className="bi bi-music-note-list display-4 text-muted"></i>
              <h4 className="mt-3">Tune Management</h4>
              <p className="text-muted">Music file management interface coming soon</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  ); 
};

export default TuneManagerPage;