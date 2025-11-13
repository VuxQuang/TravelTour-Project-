import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ImageGallery.module.css';

export default function ImageGallery({ bookingId }) {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchImages();
  }, [bookingId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/bookings/${bookingId}/images`);
      
      if (response.ok) {
        const data = await response.json();
        setImages(data.items || []);
      } else {
        setError('Failed to load images');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimary = async (imageId) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/images/${imageId}/set-primary`, {
        method: 'PUT',
      });

      if (response.ok) {
        // Refresh images
        fetchImages();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to set primary image');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm(t('booking.confirmDeleteImage'))) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/images/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh images
        fetchImages();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete image');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <div className={styles.loading}>Loading images...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.galleryHeader}>
        <h3>{t('booking.images')}</h3>
        <span className={styles.imageCount}>
          {images.length} {t('booking.images')}
        </span>
      </div>

      {images.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="fas fa-images"></i>
          <p>{t('booking.noImages')}</p>
        </div>
      ) : (
        <div className={styles.imageGrid}>
          {images.map((image) => (
            <div key={image.id} className={styles.imageCard}>
              <div className={styles.imageContainer}>
                <img
                  src={image.imageUrl}
                  alt={image.imageName}
                  onClick={() => handleImageClick(image)}
                  className={styles.image}
                />
                {image.isPrimary && (
                  <div className={styles.primaryBadge}>
                    <i className="fas fa-star"></i>
                    {t('booking.primary')}
                  </div>
                )}
              </div>
              
              <div className={styles.imageInfo}>
                <div className={styles.imageName} title={image.imageName}>
                  {image.imageName}
                </div>
                <div className={styles.imageMeta}>
                  <span>{formatFileSize(image.imageSize)}</span>
                  <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                </div>
                {image.description && (
                  <div className={styles.imageDescription}>
                    {image.description}
                  </div>
                )}
              </div>

              <div className={styles.imageActions}>
                {!image.isPrimary && (
                  <button
                    className={styles.primaryBtn}
                    onClick={() => handleSetPrimary(image.id)}
                    title={t('booking.setAsPrimary')}
                  >
                    <i className="fas fa-star"></i>
                  </button>
                )}
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteImage(image.id)}
                  title={t('booking.deleteImage')}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for image preview */}
      {showModal && selectedImage && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.imageName}
              className={styles.modalImage}
            />
            <div className={styles.modalInfo}>
              <h4>{selectedImage.imageName}</h4>
              <p>{formatFileSize(selectedImage.imageSize)}</p>
              {selectedImage.description && (
                <p>{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
