/**
 * Mobile Utility Functions
 * Device detection and capability awareness for DRIMS
 */

/**
 * Detect if device is mobile
 */
export const isMobile = () => {
  return window.innerWidth <= 768;
};

/**
 * Detect if device is tablet
 */
export const isTablet = () => {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

/**
 * Detect if device is desktop
 */
export const isDesktop = () => {
  return window.innerWidth > 1024;
};

/**
 * Detect touch support
 */
export const hasTouchSupport = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Detect camera availability
 */
export const hasCamera = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some(device => device.kind === 'videoinput');
  } catch (error) {
    return false;
  }
};

/**
 * Detect network speed (approximate)
 */
export const getNetworkSpeed = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
      if (effectiveType === '3g') return 'medium';
      return 'fast';
    }
  }
  return 'unknown';
};

/**
 * Check if network is slow
 */
export const isSlowNetwork = () => {
  return getNetworkSpeed() === 'slow';
};

/**
 * Get device type
 */
export const getDeviceType = () => {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
};

/**
 * Check media query (utility function, not a hook)
 * For React hooks, use useDeviceDetection hook instead
 */
export const checkMediaQuery = (query) => {
  if (typeof window !== 'undefined') {
    return window.matchMedia(query).matches;
  }
  return false;
};
