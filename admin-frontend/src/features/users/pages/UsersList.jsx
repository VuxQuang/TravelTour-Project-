import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { usersCrudConfig } from '../../../config/crudConfigs';
import { confirmDelete, showSuccess, showError } from '../../../utils/crudUtils';
import { 
  CrudToolbar, 
  CrudTable, 
  CrudPagination 
} from '../../../components/crud/CrudComponents';
import styles from './UsersList.module.css';

export default function UsersList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Sử dụng CRUD hook với config cho users
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
  } = useCrud(usersCrudConfig);

  // Handlers
  const handleSearch = () => {
    search({ keyword: filters.keyword });
  };

  const handleView = (id) => {
    navigate(`/admin/users/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/users/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const user = items.find(u => u.id === id);
    const confirmMessage = usersCrudConfig.deleteConfirmMessage(user);
    
    if (confirmDelete(t('users.name'), id)) {
      try {
        await remove(id);
        showSuccess(t('common.success'));
      } catch (error) {
        console.error('Failed to delete user:', error);
        showError(error.response?.data?.error || t('common.error'));
      }
    }
  };

  const handlePageChange = (newPage) => {
    fetchData({ page: newPage });
  };

  return (
    <div className={styles.usersPage}>
      <div className="content-header">
        <h1>{t('users.title')}</h1>
        <p>{t('users.list')}</p>
      </div>

      <CrudToolbar
        searchPlaceholder={usersCrudConfig.searchPlaceholder}
        createButtonText={usersCrudConfig.createButtonText}
        createPath={usersCrudConfig.createPath}
        onSearch={handleSearch}
        searchValue={filters.keyword}
        onSearchChange={(value) => search({ keyword: value })}
      />

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <CrudTable
        columns={usersCrudConfig.columns}
        data={items}
        loading={loading}
        emptyMessage={t('common.loading')}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CrudPagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={handlePageChange}
      />
    </div>
  );
}


