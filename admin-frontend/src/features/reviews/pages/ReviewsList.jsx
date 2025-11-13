import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { reviewsCrudConfig } from '../../../config/crudConfigs';
import { confirmDelete, showSuccess, showError } from '../../../utils/crudUtils';
import { 
  CrudToolbar, 
  CrudTable, 
  CrudPagination 
} from '../../../components/crud/CrudComponents';
import styles from './ReviewsList.module.css';

export default function ReviewsList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Sử dụng CRUD hook với config cho reviews
  const {
    items,
    page,
    totalPages,
    loading,
    error,
    filters,
    fetchData,
    search,
    remove
  } = useCrud(reviewsCrudConfig);

  // Handlers
  const handleSearch = () => {
    search({ keyword: filters.keyword });
  };

  const handleView = (id) => {
    navigate(`/admin/reviews/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/reviews/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const review = items.find(r => r.id === id);
    const confirmMessage = reviewsCrudConfig.deleteConfirmMessage(review);
    
    if (confirmDelete(t('reviews.title'), id)) {
      try {
        await remove(id);
        showSuccess(t('common.success'));
      } catch (error) {
        console.error('Failed to delete review:', error);
        showError(error.response?.data?.error || t('common.error'));
      }
    }
  };

  const handlePageChange = (newPage) => {
    fetchData({ page: newPage });
  };

  return (
    <div className={styles.reviewsPage}>
      <div className="content-header">
        <h1>{t('reviews.title')}</h1>
        <p>{t('reviews.list')}</p>
      </div>

      <CrudToolbar
        searchPlaceholder={reviewsCrudConfig.searchPlaceholder}
        createButtonText={reviewsCrudConfig.createButtonText}
        createPath={reviewsCrudConfig.createPath}
        onSearch={handleSearch}
        searchValue={filters.keyword}
        onSearchChange={(value) => search({ keyword: value })}
      />

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <CrudTable
        columns={reviewsCrudConfig.columns}
        data={items}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="Không có đánh giá nào"
      />

      {totalPages > 1 && (
        <CrudPagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
