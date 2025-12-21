/**
 * Device presets for Easy Preview
 * Dimensions based on common device viewport sizes
 */

const DEVICES = [
  {
    id: 'iphone-se',
    name: 'iPhone SE',
    width: 320,
    height: 568,
    category: 'phone'
  },
  {
    id: 'iphone-16',
    name: 'iPhone 16',
    width: 393,
    height: 852,
    category: 'phone'
  },
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    width: 402,
    height: 874,
    category: 'phone'
  },
  {
    id: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    width: 440,
    height: 956,
    category: 'phone'
  },
  {
    id: 'iphone-16-plus',
    name: 'iPhone 16 Plus',
    width: 430,
    height: 932,
    category: 'phone'
  },
  {
    id: 'android-compact',
    name: 'Android Compact',
    width: 412,
    height: 917,
    category: 'phone'
  },
  {
    id: 'android-medium',
    name: 'Android Medium',
    width: 700,
    height: 840,
    category: 'phone'
  },
  {
    id: 'ipad-mini',
    name: 'iPad Mini',
    width: 744,
    height: 1133,
    category: 'tablet'
  },
  {
    id: 'ipad-pro-11',
    name: 'iPad Pro 11"',
    width: 834,
    height: 1194,
    category: 'tablet'
  },
  {
    id: 'custom',
    name: 'Custom',
    width: 375,
    height: 667,
    category: 'custom'
  }
];

// Default device on load
const DEFAULT_DEVICE_ID = 'iphone-16-pro-max';

/**
 * Get device by ID
 * @param {string} id - Device ID
 * @returns {Object|undefined} Device object
 */
function getDeviceById(id) {
  return DEVICES.find(device => device.id === id);
}

/**
 * Get default device
 * @returns {Object} Default device object
 */
function getDefaultDevice() {
  return getDeviceById(DEFAULT_DEVICE_ID) || DEVICES[0];
}

/**
 * Find device by dimensions
 * @param {number} width 
 * @param {number} height 
 * @returns {Object|undefined} Matching device or undefined
 */
function findDeviceByDimensions(width, height) {
  return DEVICES.find(device => 
    device.id !== 'custom' && 
    device.width === width && 
    device.height === height
  );
}

export { DEVICES, DEFAULT_DEVICE_ID, getDeviceById, getDefaultDevice, findDeviceByDimensions };

