import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { scheduleCrudConfig } from '../../../config/crudConfigs';
import { showError } from '../../../utils/crudUtils';
import { CrudLoading, CrudError } from '../../../components/crud/CrudComponents';
import styles from './ScheduleDetail.module.css';

export default function ScheduleDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const {
    detail,
    detailLoading,
    error,
    fetchDetail
  } = useCrud(scheduleCrudConfig);

  useEffect(() => {
    if (id) {
      fetchDetail(id).catch(error => {
        console.error('Failed to fetch schedule detail:', error);
        showError(error.response?.data?.error || t('common.error'));
      });
    }
  }, [id, fetchDetail]);

  const handleEdit = () => {
    navigate(`/admin/schedule/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/admin/schedule');
  };

  if (detailLoading) {
    return <CrudLoading message={t('common.loading')} />;
  }

  if (error) {
    return <CrudError error={error} onRetry={() => fetchDetail(id)} />;
  }

  if (!detail) {
    return <div className={styles.notFound}>Không tìm thấy lịch trình</div>;
  }

  return (
    <div className={styles.scheduleDetailPage}>
      <div className="content-header">
        <div className={styles.headerActions}>
          <button onClick={handleBack} className={styles.backBtn}>
            <i className="fas fa-arrow-left"></i> {t('common.back')}
          </button>
          <button onClick={handleEdit} className={styles.editBtn}>
            <i className="fas fa-edit"></i> {t('common.edit')}
          </button>
        </div>
        <h1>{t('schedule.details')}</h1>
        <p>Schedule ID: {detail.id}</p>
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
              <label>Tiêu đề:</label>
              <span>{detail.title}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Địa điểm:</label>
              <span>{detail.location}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Ngày bắt đầu:</label>
              <span>{detail.startDate}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Ngày kết thúc:</label>
              <span>{detail.endDate}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Thời gian bắt đầu:</label>
              <span>{detail.startTime}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Thời gian kết thúc:</label>
              <span>{detail.endTime}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Trạng thái:</label>
              <span className={`${styles.status} ${styles[detail.status?.toLowerCase()]}`}>
                {detail.statusDisplay}
              </span>
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
