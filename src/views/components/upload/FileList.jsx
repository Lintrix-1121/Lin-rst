import React from 'react';
import { Card } from 'react-bootstrap';

const FileList = ({ controller }) => {
  const uploadedFiles = controller.getUploadedFiles();

  return (
    <Card className="stats-card">
      <Card.Body>
        <h6>Recent Uploads</h6>
        {uploadedFiles.length > 0 ? (
          uploadedFiles.map((file, index) => (
            <div key={index} className="file-item d-flex justify-content-between align-items-center p-2 border rounded mb-2">
              <div>
                <i className="bi bi-file-music me-2"></i>
                {file.file?.originalname || file.filename}
              </div>
              <small className="text-success">
                <i className="bi bi-check-circle"></i>
              </small>
            </div>
          ))
        ) : (
          <div className="text-center text-muted py-3">
            <i className="bi bi-inbox display-4"></i>
            <p>No recent uploads</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default FileList;