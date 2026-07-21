// src/views/components/upload/UploadForm.jsx
import React, { useState } from 'react';
import { Card, Button, ProgressBar, Form } from 'react-bootstrap';

const UploadForm = ({ controller, onUploadComplete }) => {
  const [files, setFiles] = useState([]);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    try {
      await controller.uploadFiles(files, files.length > 1);
      onUploadComplete();
      setFiles([]);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <Card className="upload-card">
      <Card.Body>
        <div className="upload-area p-4 text-center border-dashed rounded">
          <i className="bi bi-cloud-upload display-4 text-muted"></i>
          <h5 className="mt-3">Drag & Drop your files here</h5>
          <p className="text-muted">or click to browse</p>
          <Form.Group controlId="formFileMultiple" className="mb-3">
            <Form.Control 
              type="file" 
              multiple 
              accept="audio/*,video/*"
              onChange={handleFileSelect}
            />
          </Form.Group>
          <small className="text-muted">
            Supports MP3, WAV, FLAC, MP4, AVI. Max 100MB per file.
          </small>
        </div>

        {files.length > 0 && (
          <div className="mt-3">
            <h6>Selected Files:</h6>
            {files.map((file, index) => (
              <div key={index} className="file-item d-flex justify-content-between align-items-center p-2 border rounded mb-2">
                <div>
                  <i className="bi bi-file-music me-2"></i>
                  {file.name}
                </div>
                <small className="text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</small>
              </div>
            ))}
          </div>
        )}

        {controller.isUploading() && (
          <div className="mt-3">
            <ProgressBar now={controller.getProgress()} label={`${controller.getProgress()}%`} />
          </div>
        )}

        <Button 
          variant="primary" 
          className="mt-3"
          onClick={handleUpload}
          disabled={files.length === 0 || controller.isUploading()}
        >
          {controller.isUploading() ? 'Uploading...' : `Upload ${files.length} File(s)`}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default UploadForm;