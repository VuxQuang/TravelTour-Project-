import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { reviewsCrudConfig } from '../../../config/crudConfigs';
import { showError } from '../../../utils/crudUtils';
import { CrudLoading, CrudError } from '../../../components/crud/CrudComponents';
import styles from './ReviewDetail.module.css';

export default function ReviewDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const {
    detail,
    detailLoading,
    error,
    fetchDetail
  } = useCrud(reviewsCrudConfig);

  useEffect(() => {
    if (id) {
      fetchDetail(id).catch(error => {
        console.error('Failed to fetch review detail:', error);
        showError(error.response?.data?.error || t('common.error'));
      });
    }
  }, [id, fetchDetail]);

  const handleEdit = () => {
    navigate(`/admin/reviews/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/admin/reviews');
  };

  if (detailLoading) {
    return <CrudLoading message={t('common.loading')} />;
  }

  if (error) {
    return <CrudError error={error} onRetry={() => fetchDetail(id)} />;
  }

  if (!detail) {
    return <div className={styles.notFound}>Không tìm thấy đánh giá</div>;
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? styles.starActive : styles.starInactive}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className={styles.reviewDetailPage}>
      <div className="content-header">
        <div className={styles.headerActions}>
          <button onClick={handleBack} className={styles.backBtn}>
            <i className="fas fa-arrow-left"></i> {t('common.back')}
          </button>
          <button onClick={handleEdit} className={styles.editBtn}>
            <i className="fas fa-edit"></i> {t('common.edit')}
          </button>
        </div>
        <h1>{t('reviews.details')}</h1>
        <p>Review ID: {detail.id}</p>
      </div>

      <div className={styles.detailContent}>
        <div className={styles.detailCard}>
          <h3>Thông tin cơ bản</h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <label>Tour:</label>
              <span>{detail.tourTitle || 'N/A'}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Khách hàng:</label>
              <span>{detail.userName || 'N/A'}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Đánh giá:</label>
              <div className={styles.rating}>
                {renderStars(detail.rating)}
                <span className={styles.ratingText}>({detail.rating}/5)</span>
              </div>
            </div>
            <div className={styles.detailItem}>
              <label>Trạng thái:</label>
              <span className={`${styles.status} ${styles[detail.status?.toLowerCase()]}`}>
                {detail.statusDisplay}
              </span>
            </div>
            <div className={styles.detailItem}>
              <label>Ngày đánh giá:</label>
              <span>{detail.createdDateDisplay}</span>
            </div>
          </div>
        </div>

        <div className={styles.detailCard}>
          <h3>Tiêu đề</h3>
          <p>{detail.title}</p>
        </div>

        <div className={styles.detailCard}>
          <h3>Nội dung đánh giá</h3>
          <p>{detail.comment}</p>
        </div>
      </div>
    </div>
  );
}
