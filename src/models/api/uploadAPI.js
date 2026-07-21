// Mock API
export const uploadAPI = {
  uploadSingle: async (formData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      data: {
        success: true,
        message: 'File uploaded successfully',
        file: {
          originalname: 'mock-file.mp3',
          filename: `file-${Date.now()}.mp3`,
          size: 1024000,
          path: '/uploads/mock-file.mp3'
        }
      }
    };
  },
  
  uploadMultiple: async (formData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
      data: {
        success: true,
        message: 'Files uploaded successfully',
        results: [
          {
            success: true,
            file: 'file1.mp3',
            id: 1,
            title: 'Mock File 1',
            artist: 'Mock Artist'
          },
          {
            success: true,
            file: 'file2.mp3', 
            id: 2,
            title: 'Mock File 2',
            artist: 'Mock Artist'
          }
        ]
      }
    };
  }
};