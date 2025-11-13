import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CrudComponents.module.css';

export function CrudToolbar({ 
  searchPlaceholder = "Tìm kiếm...", 
  createButtonText = "Tạo mới",
  createPath,
  onSearch,
  searchValue,
  onSearchChange,
  children 
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className={styles.toolbar}>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button type="submit">
          <i className="fas fa-search"></i>
        </button>
      </form>
      
      {children}
      
      {createPath && (
        <Link className={styles.createBtn} to={createPath}>
          + {createButtonText}
        </Link>
      )}
    </div>
  );
}

/**
 * Component table với các cột có thể tùy chỉnh
 */
export function CrudTable({ 
  columns = [], 
  data = [], 
  loading = false, 
  emptyMessage = "Không có dữ liệu",
  onView,
  onEdit,
  onDelete,
  actionsColumn = true,
  actionsColumnTitle = "Hành động"
}) {
  const renderCellContent = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    return item[column.key];
  };

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.title}</th>
            ))}
            {actionsColumn && <th>{actionsColumnTitle}</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (actionsColumn ? 1 : 0)}>
                Đang tải...
              </td>
            </tr>
          ) : data.length ? (
            data.map((item, index) => (
              <tr key={item.id || index}>
                {columns.map(col => (
                  <td key={col.key}>
                    {renderCellContent(item, col)}
                  </td>
                ))}
                {actionsColumn && (
                  <td>
                    <div className={styles.actions}>
                      {onView && (
                        <button 
                          className={`${styles.actionBtn} ${styles.primary}`}
                          onClick={() => onView(item.id)}
                        >
                          Xem
                        </button>
                      )}
                      {onEdit && (
                        <button 
                          className={`${styles.actionBtn} ${styles.warning}`}
                          onClick={() => onEdit(item.id)}
                        >
                          Sửa
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          className={`${styles.actionBtn} ${styles.danger}`}
                          onClick={() => onDelete(item.id)}
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actionsColumn ? 1 : 0)}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Component pagination
 */
export function CrudPagination({ 
  totalPages, 
  currentPage, 
  onPageChange,
  showFirstLast = true,
  showPrevNext = true
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className={styles.pagination}>
      {showFirstLast && currentPage > 0 && (
        <button onClick={() => onPageChange(0)}>«</button>
      )}
      
      {showPrevNext && currentPage > 0 && (
        <button onClick={() => onPageChange(currentPage - 1)}>‹</button>
      )}
      
      {pages.map(p => (
        <button
          key={p}
          className={p === currentPage ? styles.active : ''}
          onClick={() => onPageChange(p)}
        >
          {p + 1}
        </button>
      ))}
      
      {showPrevNext && currentPage < totalPages - 1 && (
        <button onClick={() => onPageChange(currentPage + 1)}>›</button>
      )}
      
      {showFirstLast && currentPage < totalPages - 1 && (
        <button onClick={() => onPageChange(totalPages - 1)}>»</button>
      )}
    </div>
  );
}

/**
 * Component form wrapper với error handling
 */
export function CrudForm({ 
  title,
  subtitle,
  onSubmit,
  submitting = false,
  error = '',
  success = '',
  children,
  submitText = 'Lưu',
  cancelText = 'Hủy',
  onCancel,
  submitButtonClass = '',
  cancelButtonClass = ''
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className={styles.formPage}>
      <div className="content-header">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {success && <div className={styles.successMessage}>{success}</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}

        {children}

        <div className={styles.formActions}>
          <button 
            type="submit" 
            disabled={submitting} 
            className={`${styles.btn} ${styles.primary} ${submitButtonClass}`}
          >
            {submitting ? 'Đang lưu...' : submitText}
          </button>
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              className={`${styles.btn} ${cancelButtonClass}`}
            >
              {cancelText}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

/**
 * Component form field
 */
export function CrudFormField({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  required = false, 
  disabled = false,
  placeholder = '',
  options = [],
  error = '',
  className = ''
}) {
  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select 
            name={name}
            value={value} 
            onChange={handleChange} 
            required={required}
            disabled={disabled}
            className={className}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea 
            name={name}
            value={value} 
            onChange={handleChange} 
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            className={className}
          />
        );
      
      default:
        return (
          <input 
            type={type}
            name={name}
            value={value} 
            onChange={handleChange} 
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            className={className}
          />
        );
    }
  };

  return (
    <div className={styles.field}>
      <label>{label}</label>
      {renderInput()}
      {error && <div className={styles.fieldError}>{error}</div>}
    </div>
  );
}

/**
 * Component loading spinner
 */
export function CrudLoading({ message = 'Đang tải...' }) {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>{message}</p>
    </div>
  );
}

/**
 * Component error message
 */
export function CrudError({ error, onRetry }) {
  return (
    <div className={styles.error}>
      <p>{error}</p>
      {onRetry && (
        <button onClick={onRetry} className={styles.retryBtn}>
          Thử lại
        </button>
      )}
    </div>
  );
}
