import { useState, useEffect } from 'react';
import { isMobile, isTablet, isDesktop, hasTouchSupport, hasCamera, getNetworkSpeed, getDeviceType } from '../utils/mobileUtils';

/**
 * Custom hook for device detection and capabilities
 */
export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    hasTouch: false,
    hasCamera: false,
    networkSpeed: 'unknown',
    deviceType: 'desktop',
  });

  useEffect(() => {
    const updateDeviceInfo = async () => {
      const mobile = isMobile();
      const tablet = isTablet();
      const desktop = isDesktop();
      const touch = hasTouchSupport();
      const camera = await hasCamera();
      const speed = getNetworkSpeed();
      const type = getDeviceType();

      setDeviceInfo({
        isMobile: mobile,
        isTablet: tablet,
        isDesktop: desktop,
        hasTouch: touch,
        hasCamera: camera,
        networkSpeed: speed,
        deviceType: type,
      });
    };

    updateDeviceInfo();

    const handleResize = () => {
      updateDeviceInfo();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceInfo;
};
