import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { categoriesCrudConfig } from '../../../config/crudConfigs';
import { showError } from '../../../utils/crudUtils';
import { CrudLoading, CrudError } from '../../../components/crud/CrudComponents';
import styles from './CategoryDetail.module.css';

export default function CategoryDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const {
    detail,
    detailLoading,
    error,
    fetchDetail
  } = useCrud(categoriesCrudConfig);

  useEffect(() => {
    if (id) {
      fetchDetail(id).catch(error => {
        console.error('Failed to fetch category detail:', error);
        showError(error.response?.data?.error || t('common.error'));
      });
    }
  }, [id, fetchDetail]);

  const handleEdit = () => {
    navigate(`/admin/categories/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/admin/categories');
  };

  if (detailLoading) {
    return <CrudLoading message={t('common.loading')} />;
  }

  if (error) {
    return <CrudError error={error} onRetry={() => fetchDetail(id)} />;
  }

  if (!detail) {
    return <div className={styles.notFound}>Không tìm thấy danh mục</div>;
  }

  return (
    <div className={styles.categoryDetailPage}>
      <div className="content-header">
        <div className={styles.headerActions}>
          <button onClick={handleBack} className={styles.backBtn}>
            <i className="fas fa-arrow-left"></i> {t('common.back')}
          </button>
          <button onClick={handleEdit} className={styles.editBtn}>
            <i className="fas fa-edit"></i> {t('common.edit')}
          </button>
        </div>
        <h1>{t('categories.details')}</h1>
        <p>Category ID: {detail.id}</p>
      </div>

      <div className={styles.detailContent}>
        <div className={styles.detailCard}>
          <h3>Thông tin cơ bản</h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <label>Tên danh mục:</label>
              <span>{detail.name}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Trạng thái:</label>
              <span className={`${styles.status} ${styles[detail.status?.toLowerCase()]}`}>
                {detail.statusDisplay}
              </span>
            </div>
            <div className={styles.detailItem}>
              <label>Danh mục cha:</label>
              <span>{detail.parentName || 'Không có'}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Ngày tạo:</label>
              <span>{detail.createdDateDisplay}</span>
            </div>
          </div>
        </div>

        {detail.description && (
          <div className={styles.detailCard}>
            <h3>Mô tả</h3>
            <p>{detail.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
