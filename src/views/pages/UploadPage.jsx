import React, { useState } from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import UploadForm from '../components/upload/uploadForm';
import FileList from '../components/upload/FileList';
import UploadController from '../../controllers/UploadController';

const UploadPage = () => {
  const [uploadController] = useState(() => new UploadController());
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h2><i className="bi bi-cloud-upload me-2"></i>Upload Music</h2>
        <p className="text-muted">Upload audio and video files to your library</p>
      </div>

      {uploadController.getError() && (
        <Alert variant="danger" dismissible onClose={() => uploadController.error = null}>
          {uploadController.getError()}
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <UploadForm 
            controller={uploadController}
            onUploadComplete={handleUploadComplete}
          />
        </Col>
        <Col lg={4}>
          <FileList 
            key={refreshKey}
            controller={uploadController}
          />
        </Col>
      </Row>
    </div>
  );
};

export default UploadPage;