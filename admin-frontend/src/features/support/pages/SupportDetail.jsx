import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { supportCrudConfig } from '../../../config/crudConfigs';
import { showError } from '../../../utils/crudUtils';
import { CrudLoading, CrudError } from '../../../components/crud/CrudComponents';
import styles from './SupportDetail.module.css';

export default function SupportDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const {
    detail,
    detailLoading,
    error,
    fetchDetail
  } = useCrud(supportCrudConfig);

  useEffect(() => {
    if (id) {
      fetchDetail(id).catch(error => {
        console.error('Failed to fetch support detail:', error);
        showError(error.response?.data?.error || t('common.error'));
      });
    }
  }, [id, fetchDetail]);

  const handleEdit = () => {
    navigate(`/admin/support/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/admin/support');
  };

  if (detailLoading) {
    return <CrudLoading message={t('common.loading')} />;
  }

  if (error) {
    return <CrudError error={error} onRetry={() => fetchDetail(id)} />;
  }

  if (!detail) {
    return <div className={styles.notFound}>Không tìm thấy ticket hỗ trợ</div>;
  }

  return (
    <div className={styles.supportDetailPage}>
      <div className="content-header">
        <div className={styles.headerActions}>
          <button onClick={handleBack} className={styles.backBtn}>
            <i className="fas fa-arrow-left"></i> {t('common.back')}
          </button>
          <button onClick={handleEdit} className={styles.editBtn}>
            <i className="fas fa-edit"></i> {t('common.edit')}
          </button>
        </div>
        <h1>{t('support.details')}</h1>
        <p>Ticket ID: {detail.id}</p>
      </div>

      <div className={styles.detailContent}>
        <div className={styles.detailCard}>
          <h3>Thông tin cơ bản</h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <label>Tiêu đề:</label>
              <span>{detail.subject}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Danh mục:</label>
              <span>{detail.category}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Độ ưu tiên:</label>
              <span className={`${styles.priority} ${styles[detail.priority?.toLowerCase()]}`}>
                {detail.priority}
              </span>
            </div>
            <div className={styles.detailItem}>
              <label>Trạng thái:</label>
              <span className={`${styles.status} ${styles[detail.status?.toLowerCase()]}`}>
                {detail.statusDisplay}
              </span>
            </div>
            <div className={styles.detailItem}>
              <label>Khách hàng:</label>
              <span>{detail.userName || 'N/A'}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Ngày tạo:</label>
              <span>{detail.createdDateDisplay}</span>
            </div>
          </div>
        </div>

        <div className={styles.detailCard}>
          <h3>Mô tả vấn đề</h3>
          <p>{detail.description}</p>
        </div>

        {detail.response && (
          <div className={styles.detailCard}>
            <h3>Phản hồi</h3>
            <p>{detail.response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
