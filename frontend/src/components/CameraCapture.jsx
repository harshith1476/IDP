import { useState, useRef } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import './CameraCapture.css';

/**
 * Camera Capture Component for Mobile
 * Allows camera capture instead of file upload on mobile devices
 */
function CameraCapture({ onCapture, onCancel, accept = 'image/*' }) {
  const { hasCamera, isMobile } = useDeviceDetection();
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        // Compress image
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        setCapturedImage(URL.createObjectURL(blob));
        stopCamera();
        if (onCapture) {
          onCapture(file);
        }
      }, 'image/jpeg', 0.8); // 80% quality
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleCancel = () => {
    stopCamera();
    if (onCancel) {
      onCancel();
    }
  };

  // Show file input if no camera or not mobile
  if (!hasCamera || !isMobile) {
    return null; // Fallback to regular file input
  }

  return (
    <div className="camera-capture-overlay">
      <div className="camera-capture-container">
        <div className="camera-header">
          <h3>Capture Photo</h3>
          <button className="close-btn" onClick={handleCancel}>×</button>
        </div>

        {!capturedImage ? (
          <>
            <div className="camera-preview">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="camera-video"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            <div className="camera-controls">
              {!stream ? (
                <button className="camera-btn start-btn" onClick={startCamera}>
                  Start Camera
                </button>
              ) : (
                <button className="camera-btn capture-btn" onClick={capturePhoto}>
                  Capture Photo
                </button>
              )}
              <button className="camera-btn cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="captured-preview">
              <img src={capturedImage} alt="Captured" />
            </div>
            <div className="camera-controls">
              <button className="camera-btn retake-btn" onClick={retakePhoto}>
                Retake
              </button>
              <button className="camera-btn confirm-btn" onClick={() => {
                if (onCapture) {
                  // File already captured, just close
                  handleCancel();
                }
              }}>
                Use This Photo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CameraCapture;
