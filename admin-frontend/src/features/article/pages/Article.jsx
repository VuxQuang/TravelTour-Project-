import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { articlesCrudConfig } from '../../../config/crudConfigs';
import { confirmDelete, showSuccess, showError } from '../../../utils/crudUtils';
import { 
  CrudToolbar, 
  CrudTable, 
  CrudPagination 
} from '../../../components/crud/CrudComponents';
import styles from './Article.module.css';

export default function ArticlesList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Sử dụng CRUD hook với config cho articles
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
  } = useCrud(articlesCrudConfig);

  // Handlers
  const handleSearch = () => {
    search({ keyword: filters.keyword });
  };

  const handleView = (id) => {
    navigate(`/admin/articles/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/articles/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const article = items.find(a => a.id === id);
    const confirmMessage = articlesCrudConfig.deleteConfirmMessage(article);
    
    if (confirmDelete(t('articles.titleField'), id)) {
      try {
        await remove(id);
        showSuccess(t('common.success'));
      } catch (error) {
        console.error('Failed to delete article:', error);
        showError(error.response?.data?.error || t('common.error'));
      }
    }
  };

  const handlePageChange = (newPage) => {
    fetchData({ page: newPage });
  };

  return (
    <div className={styles.articlesPage}>
      <div className="content-header">
        <h1>{t('articles.title')}</h1>
        <p>{t('articles.list')}</p>
      </div>

      <CrudToolbar
        searchPlaceholder={articlesCrudConfig.searchPlaceholder}
        createButtonText={articlesCrudConfig.createButtonText}
        createPath={articlesCrudConfig.createPath}
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
        columns={articlesCrudConfig.columns}
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