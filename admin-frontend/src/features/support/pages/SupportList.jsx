import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { supportCrudConfig } from '../../../config/crudConfigs';
import { confirmDelete, showSuccess, showError } from '../../../utils/crudUtils';
import { 
  CrudToolbar, 
  CrudTable, 
  CrudPagination 
} from '../../../components/crud/CrudComponents';
import styles from './SupportList.module.css';

export default function SupportList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Sử dụng CRUD hook với config cho support
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
  } = useCrud(supportCrudConfig);

  // Handlers
  const handleSearch = () => {
    search({ keyword: filters.keyword });
  };

  const handleView = (id) => {
    navigate(`/admin/support/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/support/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const support = items.find(s => s.id === id);
    const confirmMessage = supportCrudConfig.deleteConfirmMessage(support);
    
    if (confirmDelete(t('support.title'), id)) {
      try {
        await remove(id);
        showSuccess(t('common.success'));
      } catch (error) {
        console.error('Failed to delete support:', error);
        showError(error.response?.data?.error || t('common.error'));
      }
    }
  };

  const handlePageChange = (newPage) => {
    fetchData({ page: newPage });
  };

  return (
    <div className={styles.supportPage}>
      <div className="content-header">
        <h1>{t('support.title')}</h1>
        <p>{t('support.list')}</p>
      </div>

      <CrudToolbar
        searchPlaceholder={supportCrudConfig.searchPlaceholder}
        createButtonText={supportCrudConfig.createButtonText}
        createPath={supportCrudConfig.createPath}
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
        columns={supportCrudConfig.columns}
        data={items}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="Không có ticket hỗ trợ nào"
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
