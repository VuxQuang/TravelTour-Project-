
// Hooks
export { useCrud, usePagination } from '../hooks/useCrud';

// Components
export {
  CrudToolbar,
  CrudTable,
  CrudPagination,
  CrudForm,
  CrudFormField,
  CrudLoading,
  CrudError
} from './crud/CrudComponents';

// Utils
export {
  confirmDelete,
  showSuccess,
  showError,
  formatDate,
  formatDateTime,
  formatCurrency,
  formatNumber,
  getStatusBadge,
  debounce,
  isValidEmail,
  isValidPhone,
  generateId,
  deepClone,
  deepMerge,
  truncateText,
  capitalize,
  toSlug,
  getFileExtension,
  formatFileSize
} from '../utils/crudUtils';

// Configs
export {
  usersCrudConfig,
  toursCrudConfig,
  bookingsCrudConfig,
  categoriesCrudConfig,
  articlesCrudConfig,
  createCrudConfig
} from '../config/crudConfigs';
