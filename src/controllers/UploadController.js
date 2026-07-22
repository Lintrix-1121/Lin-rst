class UploadController {
  constructor() {
    this.progress = 0;
    this.uploading = false;
    this.error = null;
    this.uploadedFiles = [];
  }

  async uploadFiles(files, isBatch = false) {
    this.uploading = true;
    this.progress = 0;
    this.error = null;

    const formData = new FormData();
    
    if (isBatch) {
      files.forEach(file => {
        formData.append('files', file);
      });
    } else {
      formData.append('file', files[0]);
    }

    try {
      // Real API call to your backend
      const endpoint = isBatch ? '/upload/batch' : '/upload';
      
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          this.progress = Math.round((event.loaded / event.total) * 100);
        }
      });

      const response = await new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const responseData = JSON.parse(xhr.responseText);
              resolve(responseData);
            } catch (parseError) {
              reject(new Error('Invalid JSON response'));
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        xhr.open('POST', `${import.meta.env.VITE_API_URL}${endpoint}`);
        xhr.send(formData);
      });

      this.progress = 100;
      this.uploading = false;
      
      // Handle response based on your backend structure
      if (response.success) {
        this.uploadedFiles = isBatch ? response.results : [response.data];
        return response;
      } else {
        throw new Error(response.message || 'Upload failed');
      }

    } catch (error) {
      this.uploading = false;
      this.error = error.message;
      console.error('Upload error:', error);
      throw error;
    }
  }

  getProgress() {
    return this.progress;
  }

  isUploading() {
    return this.uploading;
  }

  getError() {
    return this.error;
  }

  getUploadedFiles() {
    return this.uploadedFiles;
  }

  reset() {
    this.progress = 0;
    this.uploading = false;
    this.error = null;
    this.uploadedFiles = [];
  }
}

export default UploadController;






