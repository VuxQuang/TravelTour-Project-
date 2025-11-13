/**
 * Utility functions cho CRUD operations
 */

/**
 * @param {string} itemName - Tên của item sẽ bị xóa
 * @param {string} itemId - ID của item
 * @returns {boolean} - true nếu user confirm, false nếu cancel
 */
export function confirmDelete(itemName = 'item', itemId = '') {
  const message = `Bạn có chắc chắn muốn xóa ${itemName}${itemId ? ` ID: ${itemId}` : ''}?\n\nHành động này không thể hoàn tác!`;
  return window.confirm(message);
}

/**
 * Hiển thị success message
 * @param {string} message - Message để hiển thị
 */
export function showSuccess(message) {
  alert(message);
}

/**
 * Hiển thị error message
 * @param {string} message - Message để hiển thị
 */
export function showError(message) {
  alert(message);
}

/**
 * Format date cho hiển thị
 * @param {string|Date} date - Date để format
 * @param {string} locale - Locale (mặc định: 'vi-VN')
 * @returns {string} - Formatted date
 */
export function formatDate(date, locale = 'vi-VN') {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Format datetime cho hiển thị
 * @param {string|Date} date - Date để format
 * @param {string} locale - Locale (mặc định: 'vi-VN')
 * @returns {string} - Formatted datetime
 */
export function formatDateTime(date, locale = 'vi-VN') {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '';
  }
}

/**
 * Format currency
 * @param {number} amount - Số tiền
 * @param {string} currency - Currency code (mặc định: 'VND')
 * @param {string} locale - Locale (mặc định: 'vi-VN')
 * @returns {string} - Formatted currency
 */
export function formatCurrency(amount, currency = 'VND', locale = 'vi-VN') {
  if (amount === null || amount === undefined) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${amount} ${currency}`;
  }
}

/**
 * Format number với thousand separator
 * @param {number} number - Số để format
 * @param {string} locale - Locale (mặc định: 'vi-VN')
 * @returns {string} - Formatted number
 */
export function formatNumber(number, locale = 'vi-VN') {
  if (number === null || number === undefined) return '';
  
  try {
    return new Intl.NumberFormat(locale).format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return number.toString();
  }
}

/**
 * Tạo status badge với màu sắc
 * @param {string} status - Status value
 * @param {Object} statusConfig - Config cho các status
 * @returns {Object} - { text, className }
 */
export function getStatusBadge(status, statusConfig = {}) {
  const defaultConfig = {
    ACTIVE: { text: 'Hoạt động', className: 'status-active' },
    INACTIVE: { text: 'Không hoạt động', className: 'status-inactive' },
    PENDING: { text: 'Chờ duyệt', className: 'status-pending' },
    APPROVED: { text: 'Đã duyệt', className: 'status-approved' },
    REJECTED: { text: 'Từ chối', className: 'status-rejected' },
    COMPLETED: { text: 'Hoàn thành', className: 'status-completed' },
    CANCELLED: { text: 'Đã hủy', className: 'status-cancelled' }
  };
  
  const config = { ...defaultConfig, ...statusConfig };
  return config[status] || { text: status, className: 'status-default' };
}

/**
 * Debounce function để delay search
 * @param {Function} func - Function để debounce
 * @param {number} delay - Delay time (ms)
 * @returns {Function} - Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Validate email
 * @param {string} email - Email để validate
 * @returns {boolean} - true nếu valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Vietnam format)
 * @param {string} phone - Phone để validate
 * @returns {boolean} - true nếu valid
 */
export function isValidPhone(phone) {
  const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Generate random ID
 * @param {number} length - Độ dài ID (mặc định: 8)
 * @returns {string} - Random ID
 */
export function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Deep clone object
 * @param {any} obj - Object để clone
 * @returns {any} - Cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * Merge objects deeply
 * @param {Object} target - Target object
 * @param {...Object} sources - Source objects
 * @returns {Object} - Merged object
 */
export function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  
  return deepMerge(target, ...sources);
}

/**
 * Check if value is object
 * @param {any} item - Value để check
 * @returns {boolean} - true nếu là object
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Truncate text với ellipsis
 * @param {string} text - Text để truncate
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} - Truncated text
 */
export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Capitalize first letter
 * @param {string} str - String để capitalize
 * @returns {string} - Capitalized string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to slug
 * @param {string} str - String để convert
 * @returns {string} - Slug string
 */
export function toSlug(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get file extension
 * @param {string} filename - Filename
 * @returns {string} - File extension
 */
export function getFileExtension(filename) {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
}

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
