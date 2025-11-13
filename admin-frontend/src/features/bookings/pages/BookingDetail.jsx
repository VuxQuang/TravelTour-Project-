import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { bookingsCrudConfig } from '../../../config/crudConfigs';
import { showError, showSuccess } from '../../../utils/crudUtils';
import { CrudLoading, CrudError } from '../../../components/crud/CrudComponents';
import ImageUpload from '../../../components/booking/ImageUpload';
import ImageGallery from '../../../components/booking/ImageGallery';
import styles from './BookingDetail.module.css';

export default function BookingDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [showTourImageModal, setShowTourImageModal] = useState(false);
  
  const {
    detail,
    detailLoading,
    error,
    fetchDetail
  } = useCrud(bookingsCrudConfig);

  useEffect(() => {
    if (id) {
      fetchDetail(id).catch(error => {
        console.error('Failed to fetch booking detail:', error);
        showError(error.response?.data?.error || t('common.error'));
      });
    }
  }, [id, fetchDetail]);

  const handleEdit = () => {
    navigate(`/admin/bookings/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/admin/bookings');
  };

  const handleUploadSuccess = (uploadedImages) => {
    showSuccess(t('booking.uploadSuccess'));
    // Refresh the page or update state as needed
  };

  const handleUploadError = (error) => {
    showError(error);
  };

  if (detailLoading) {
    return <CrudLoading message={t('common.loading')} />;
  }

  if (error) {
    return <CrudError error={error} onRetry={() => fetchDetail(id)} />;
  }

  if (!detail) {
    return <div className={styles.notFound}>Không tìm thấy booking</div>;
  }

  return (
    <div className={styles.bookingDetailPage}>
      <div className="content-header">
        <div className={styles.headerActions}>
          <button onClick={handleBack} className={styles.backBtn}>
            <i className="fas fa-arrow-left"></i> {t('common.back')}
          </button>
          <button onClick={handleEdit} className={styles.editBtn}>
            <i className="fas fa-edit"></i> {t('common.edit')}
          </button>
        </div>
        <h1>{t('bookings.details')}</h1>
        <p>Booking ID: {detail.id}</p>
      </div>

      <div className={styles.detailContent}>
        <div className={styles.detailCard}>
          <h3>Thông tin cơ bản</h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <label>Tour:</label>
              <div className={styles.tourInfo}>
                <span>{detail.tourTitle || 'N/A'}</span>
                {detail.tourImage && (
                  <div 
                    className={styles.tourImageContainer}
                    onClick={() => setShowTourImageModal(true)}
                  >
                    <img 
                      src={detail.tourImage} 
                      alt={detail.tourTitle}
                      className={styles.tourImage}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.detailItem}>
              <label>Khách hàng:</label>
              <span>{detail.userName || 'N/A'}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Số người tham gia:</label>
              <span>{detail.participants}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Tổng tiền:</label>
              <span>{detail.totalPriceDisplay}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Trạng thái:</label>
              <span className={`${styles.status} ${styles[detail.status?.toLowerCase()]}`}>
                {detail.statusDisplay}
              </span>
            </div>
            <div className={styles.detailItem}>
              <label>Ngày đặt:</label>
              <span>{detail.bookingDateDisplay}</span>
            </div>
          </div>
        </div>

        {detail.notes && (
          <div className={styles.detailCard}>
            <h3>Ghi chú</h3>
            <p>{detail.notes}</p>
          </div>
        )}

        {/* Image Management Section */}
        <div className={styles.detailCard}>
          <h3>{t('booking.imageManagement')}</h3>
          
          {/* Upload Section */}
          <div className={styles.uploadSection}>
            <h4>{t('booking.uploadImages')}</h4>
            <ImageUpload
              bookingId={id}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </div>

          {/* Gallery Section */}
          <div className={styles.gallerySection}>
            <ImageGallery bookingId={id} />
          </div>
        </div>
      </div>

      {/* Tour Image Modal */}
      {showTourImageModal && detail.tourImage && (
        <div className={styles.modal} onClick={() => setShowTourImageModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeBtn} 
              onClick={() => setShowTourImageModal(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            <img
              src={detail.tourImage}
              alt={detail.tourTitle}
              className={styles.modalImage}
            />
            <div className={styles.modalInfo}>
              <h4>{detail.tourTitle}</h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
