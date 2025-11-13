import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { toursCrudConfig } from '../../../config/crudConfigs';
import { confirmDelete, showSuccess, showError } from '../../../utils/crudUtils';
import { 
  CrudToolbar, 
  CrudTable, 
  CrudPagination 
} from '../../../components/crud/CrudComponents';
import styles from './ToursList.module.css';

export default function ToursList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Sử dụng CRUD hook với config cho tours
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
  } = useCrud(toursCrudConfig);

  // Handlers
  const handleSearch = () => {
    search({ keyword: filters.keyword });
  };

  const handleView = (id) => {
    navigate(`/admin/tours/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/tours/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const tour = items.find(t => t.id === id);
    const confirmMessage = toursCrudConfig.deleteConfirmMessage(tour);
    
    if (confirmDelete(t('tours.title'), id)) {
      try {
        await remove(id);
        showSuccess(t('tours.deleteSuccess'));
      } catch (error) {
        console.error('Failed to delete tour:', error);
        showError(error.response?.data?.error || t('common.error'));
      }
    }
  };

  const handlePageChange = (newPage) => {
    fetchData({ page: newPage });
  };

  return (
    <div className={styles.toursPage}>
      <div className="content-header">
        <h1>{t('tours.title')}</h1>
        <p>{t('tours.list')}</p>
      </div>

      <CrudToolbar
        searchPlaceholder={toursCrudConfig.searchPlaceholder}
        createButtonText={toursCrudConfig.createButtonText}
        createPath={toursCrudConfig.createPath}
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
        columns={toursCrudConfig.columns}
        data={items}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="Không có tour nào"
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
