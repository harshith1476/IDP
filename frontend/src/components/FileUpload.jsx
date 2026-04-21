import { useState, useRef } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import CameraCapture from './CameraCapture';
import { API_BASE_URL } from '../services/api';

/**
 * Reusable FileUpload component for PDF uploads
 * @param {Object} props
 * @param {string} props.label - Label for the file input
 * @param {string} props.acceptedFile - Current file path (for display)
 * @param {Function} props.onFileChange - Callback when file is selected (receives file object)
 * @param {boolean} props.required - Whether file upload is required
 * @param {Function} props.onUpload - Optional callback to handle upload immediately
 * @param {string} props.userType - 'faculty' or 'student'
 * @param {string} props.userId - Faculty ID or Student ID
 * @param {string} props.category - Category for file organization
 * @param {boolean} props.disabled - Whether the input is disabled
 */
function FileUpload({
  label,
  acceptedFile,
  onFileChange,
  required = false,
  onUpload,
  userType,
  userId,
  category,
  disabled = false,
  accept = '.pdf,application/pdf',
  allowCamera = false
}) {
  const { hasCamera, isMobile } = useDeviceDetection();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type - only PDF
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are allowed');
      return;
    }

    setError('');
    setSelectedFile(file);

    // Call the onChange callback
    if (onFileChange) {
      onFileChange(file);
    }

    // If onUpload is provided, upload immediately
    if (onUpload && userType && userId && category) {
      handleUpload(file);
    }
  };

  const handleCameraCapture = (file) => {
    setSelectedFile(file);
    setShowCamera(false);
    if (onFileChange) {
      onFileChange(file);
    }
    if (onUpload && userType && userId && category) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file = selectedFile) => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    if (!userType || !userId || !category) {
      setError('Missing required parameters for upload. Please ensure you are logged in and try again.');
      console.error('Upload parameters:', { userType, userId, category });
      return;
    }

    if (!userId || userId.trim() === '') {
      setError('User ID not available. Please refresh the page and try again.');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userType', userType);
      formData.append('userId', userId);
      formData.append('category', category);

      const apiBaseUrl = API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorText = await response.text();
          // Try to parse as JSON, if fails use as plain text
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData || errorText;
          } catch {
            errorMessage = errorText || `Server error: ${response.status} ${response.statusText}`;
          }
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Backend returns plain text (file path), not JSON
      const result = await response.text();
      setUploadProgress(100);

      if (onUpload) {
        onUpload(result); // Pass the file path back
      }

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to upload file. Please check your connection and try again.';
      setError(errorMsg);
      console.error('File upload error:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        userType,
        userId,
        category
      });
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileChange) {
      onFileChange(null);
    }
  };

  const handleDownload = () => {
    if (!acceptedFile) return;

    const apiBaseUrl = API_BASE_URL;
    const downloadUrl = `${apiBaseUrl}/files/download?path=${encodeURIComponent(acceptedFile)}`;
    window.open(downloadUrl, '_blank');
  };

  const getFileName = (path) => {
    if (!path) return '';
    return path.split('/').pop() || path;
  };

  return (
    <div className="mb-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Current file display */}
      {acceptedFile && !selectedFile && (
        <div className="mb-1 p-1.5 bg-green-50 border border-green-200 rounded flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs text-gray-700 truncate max-w-[150px] sm:max-w-xs">{getFileName(acceptedFile)}</span>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
            disabled={disabled}
          >
            View
          </button>
        </div>
      )}

      {/* File input */}
      <div className="flex flex-col gap-2">
        {/* Camera button for mobile (if enabled) */}
        {allowCamera && hasCamera && isMobile && !disabled && (
          <button
            type="button"
            onClick={() => setShowCamera(true)}
            className="w-full px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-camera"></i>
            Capture with Camera
          </button>
        )}

        <label className={`flex-1 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={disabled || uploading}
            className="hidden"
          />
          <div className={`border-2 border-dashed rounded-lg p-2 text-center transition-colors ${disabled
              ? 'border-gray-300 bg-gray-50'
              : error
                ? 'border-red-300 bg-red-50'
                : selectedFile
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
            }`}>
            {uploading ? (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
              </div>
            ) : selectedFile ? (
              <div className="space-y-2">
                <svg className="w-5 h-5 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg className="w-6 h-6 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF only (Max 10MB)</p>
              </div>
            )}
          </div>
        </label>

        {/* Remove button */}
        {selectedFile && !uploading && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            Remove
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Help text */}
      {!error && !selectedFile && !acceptedFile && (
        <p className="mt-1 text-xs text-gray-500">
          {required ? 'This file is required for submission' : 'Optional file upload'}
        </p>
      )}

      {/* Camera Capture Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onCancel={() => setShowCamera(false)}
          accept={accept}
        />
      )}
    </div>
  );
}

export default FileUpload;
