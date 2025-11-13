import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { promotionsCrudConfig } from '../../../config/crudConfigs';
import { showError } from '../../../utils/crudUtils';
import styles from './PromotionDetail.module.css';

export default function PromotionDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const {
    detail: item,
    detailLoading: loading,
    error,
    fetchDetail: fetchById
  } = useCrud(promotionsCrudConfig);

  useEffect(() => {
    if (id) {
      fetchById(id);
    }
  }, [id, fetchById]);

  const handleEdit = () => {
    navigate(`/admin/promotions/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/admin/promotions');
  };

  const getStatusClass = (status, startDate, endDate) => {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (status === 'INACTIVE') {
      return 'inactive';
    }
    
    if (start && now < start) {
      return 'pending';
    }
    
    if (end && now > end) {
      return 'expired';
    }
    
    return 'active';
  };

  const getStatusText = (status, startDate, endDate) => {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (status === 'INACTIVE') {
      return 'Không hoạt động';
    }
    
    if (start && now < start) {
      return 'Chưa bắt đầu';
    }
    
    if (end && now > end) {
      return 'Đã hết hạn';
    }
    
    return 'Đang hoạt động';
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
          Không tìm thấy mã giảm giá
        </div>
      </div>
    );
  }

  const statusClass = getStatusClass(item.status, item.startDate, item.endDate);
  const statusText = getStatusText(item.status, item.startDate, item.endDate);
  const usagePercentage = item.usageLimit ? (item.usedCount / item.usageLimit) * 100 : 0;

  return (
    <div className={styles.detailPage}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>{item.title}</h1>
          <p>Chi tiết mã giảm giá</p>
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
                <label>Mã giảm giá:</label>
                <span className={styles.promotionCode}>{item.code}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Trạng thái:</label>
                <span className={`${styles.statusBadge} ${styles[statusClass]}`}>
                  {statusText}
                </span>
              </div>
              <div className={styles.infoItem}>
                <label>Loại giảm giá:</label>
                <span>{item.discountType === 'PERCENTAGE' ? 'Phần trăm' : 'Số tiền cố định'}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Giá trị giảm:</label>
                <span className={styles.discountValue}>
                  {item.discountType === 'PERCENTAGE' 
                    ? `${item.discountValue}%`
                    : new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(item.discountValue)
                  }
                </span>
              </div>
              <div className={styles.infoItem}>
                <label>Đơn tối thiểu:</label>
                <span>
                  {item.minOrderAmount > 0 
                    ? new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(item.minOrderAmount)
                    : 'Không giới hạn'
                  }
                </span>
              </div>
              {item.maxDiscountAmount && (
                <div className={styles.infoItem}>
                  <label>Giảm tối đa:</label>
                  <span>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(item.maxDiscountAmount)}
                  </span>
                </div>
              )}
              <div className={styles.infoItem}>
                <label>Giới hạn sử dụng:</label>
                <span>
                  {item.usageLimit ? `${item.usageLimit} lần` : 'Không giới hạn'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <label>Đã sử dụng:</label>
                <span>{item.usedCount} lần</span>
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3>Mô tả</h3>
            <div className={styles.description}>
              {item.description || 'Chưa có mô tả'}
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3>Thời gian áp dụng</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Ngày bắt đầu:</label>
                <span>{item.startDate || 'Không giới hạn'}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Ngày kết thúc:</label>
                <span>{item.endDate || 'Không giới hạn'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.infoCard}>
            <h3>Thống kê sử dụng</h3>
            <div className={styles.usageStats}>
              <div className={styles.usageItem}>
                <span className={styles.usageLabel}>Đã sử dụng:</span>
                <span className={styles.usageValue}>{item.usedCount} lần</span>
              </div>
              {item.usageLimit && (
                <>
                  <div className={styles.usageItem}>
                    <span className={styles.usageLabel}>Còn lại:</span>
                    <span className={styles.usageValue}>{item.usageLimit - item.usedCount} lần</span>
                  </div>
                  <div className={styles.usageBar}>
                    <div 
                      className={styles.usageFill}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className={styles.usagePercentage}>
                    {usagePercentage.toFixed(1)}% đã sử dụng
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3>Thông tin khác</h3>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>ID:</span>
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
