import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { scheduleCrudConfig } from '../../../config/crudConfigs';
import { confirmDelete, showSuccess, showError } from '../../../utils/crudUtils';
import { 
  CrudToolbar, 
  CrudTable, 
  CrudPagination 
} from '../../../components/crud/CrudComponents';
import styles from './ScheduleList.module.css';

export default function ScheduleList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Sử dụng CRUD hook với config cho schedule
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
  } = useCrud(scheduleCrudConfig);

  // Handlers
  const handleSearch = () => {
    search({ keyword: filters.keyword });
  };

  const handleView = (id) => {
    navigate(`/admin/schedule/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/schedule/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const schedule = items.find(s => s.id === id);
    const confirmMessage = scheduleCrudConfig.deleteConfirmMessage(schedule);
    
    if (confirmDelete(t('schedule.title'), id)) {
      try {
        await remove(id);
        showSuccess(t('common.success'));
      } catch (error) {
        console.error('Failed to delete schedule:', error);
        showError(error.response?.data?.error || t('common.error'));
      }
    }
  };

  const handlePageChange = (newPage) => {
    fetchData({ page: newPage });
  };

  return (
    <div className={styles.schedulePage}>
      <div className="content-header">
        <h1>{t('schedule.title')}</h1>
        <p>{t('schedule.list')}</p>
      </div>

      <CrudToolbar
        searchPlaceholder={scheduleCrudConfig.searchPlaceholder}
        createButtonText={scheduleCrudConfig.createButtonText}
        createPath={scheduleCrudConfig.createPath}
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
        columns={scheduleCrudConfig.columns}
        data={items}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="Không có lịch trình nào"
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
