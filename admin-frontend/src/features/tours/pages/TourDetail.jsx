import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { toursCrudConfig } from '../../../config/crudConfigs';
import { showError } from '../../../utils/crudUtils';
import styles from './TourDetail.module.css';

export default function TourDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const {
    detail: item,
    detailLoading: loading,
    error,
    fetchDetail: fetchById
  } = useCrud(toursCrudConfig);

  useEffect(() => {
    if (id) {
      fetchById(id);
    }
  }, [id, fetchById]);

  const handleEdit = () => {
    navigate(`/admin/tours/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/admin/tours');
  };

  if (loading) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.loading}>Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.errorMessage}>
          {error}
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.errorMessage}>
          Không tìm thấy tour
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>{item.title}</h1>
          <p>Chi tiết tour du lịch</p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.btnSecondary}
            onClick={handleBack}
          >
            Quay lại
          </button>
          <button 
            className={styles.btnPrimary}
            onClick={handleEdit}
          >
            Chỉnh sửa
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <div className={styles.infoCard}>
            <h3>Thông tin cơ bản</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Tên tour:</label>
                <span>{item.title}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Trạng thái:</label>
                <span className={`${styles.status} ${styles[item.status?.toLowerCase()]}`}>
                  {item.status === 'ACTIVE' ? 'Hoạt động' : 
                   item.status === 'INACTIVE' ? 'Không hoạt động' : 'Bản nháp'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <label>Giá tour:</label>
                <span className={styles.price}>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(item.price)}
                </span>
              </div>
              <div className={styles.infoItem}>
                <label>Thời gian:</label>
                <span>{item.duration} ngày</span>
              </div>
              <div className={styles.infoItem}>
                <label>Số người tối đa:</label>
                <span>{item.maxParticipants} người</span>
              </div>
              <div className={styles.infoItem}>
                <label>Địa điểm:</label>
                <span>{item.location}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Ngày bắt đầu:</label>
                <span>{item.startDate || 'Chưa xác định'}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Ngày kết thúc:</label>
                <span>{item.endDate || 'Chưa xác định'}</span>
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3>Mô tả</h3>
            <div className={styles.description}>
              {item.description || 'Chưa có mô tả'}
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.infoCard}>
            <h3>Thống kê</h3>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>ID Tour:</span>
                <span className={styles.statValue}>#{item.id}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Ngày tạo:</span>
                <span className={styles.statValue}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Cập nhật cuối:</span>
                <span className={styles.statValue}>
                  {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
