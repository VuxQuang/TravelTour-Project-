import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { promotionsCrudConfig } from '../../../config/crudConfigs';
import { confirmDelete, showSuccess, showError } from '../../../utils/crudUtils';
import { 
  CrudToolbar, 
  CrudTable, 
  CrudPagination 
} from '../../../components/crud/CrudComponents';
import styles from './PromotionsList.module.css';

export default function PromotionsList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Sử dụng CRUD hook với config cho promotions
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
  } = useCrud(promotionsCrudConfig);

  // Handlers
  const handleSearch = () => {
    search({ keyword: filters.keyword });
  };

  const handleView = (id) => {
    navigate(`/admin/promotions/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/promotions/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const promotion = items.find(p => p.id === id);
    const confirmMessage = promotionsCrudConfig.deleteConfirmMessage(promotion);
    
    if (confirmDelete(t('promotions.title'), id)) {
      try {
        await remove(id);
        showSuccess(t('promotions.deleteSuccess'));
      } catch (error) {
        console.error('Failed to delete promotion:', error);
        showError(error.response?.data?.error || t('common.error'));
      }
    }
  };

  const handlePageChange = (newPage) => {
    fetchData({ page: newPage });
  };

  return (
    <div className={styles.promotionsPage}>
      <div className="content-header">
        <h1>{t('promotions.title')}</h1>
        <p>{t('promotions.list')}</p>
      </div>

      <CrudToolbar
        searchPlaceholder={promotionsCrudConfig.searchPlaceholder}
        createButtonText={promotionsCrudConfig.createButtonText}
        createPath={promotionsCrudConfig.createPath}
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
        columns={promotionsCrudConfig.columns}
        data={items}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="Không có mã giảm giá nào"
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
