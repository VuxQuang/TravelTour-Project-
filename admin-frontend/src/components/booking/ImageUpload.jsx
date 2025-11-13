import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ImageUpload.module.css';

export default function ImageUpload({ bookingId, onUploadSuccess, onUploadError }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (files) => {
    if (files && files.length > 0) {
      uploadFiles(Array.from(files));
    }
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('uploadedBy', 'admin');

      const response = await fetch(`/api/admin/bookings/${bookingId}/images/upload-multiple`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadProgress(100);
        onUploadSuccess?.(result.items);
      } else {
        const error = await response.json();
        onUploadError?.(error.error || 'Upload failed');
      }
    } catch (error) {
      onUploadError?.(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    handleFileSelect(e.target.files);
  };

  return (
    <div className={styles.uploadContainer}>
      <div
        className={`${styles.uploadArea} ${dragOver ? styles.dragOver : ''} ${uploading ? styles.uploading : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        {uploading ? (
          <div className={styles.uploadingContent}>
            <div className={styles.spinner}></div>
            <p>{t('booking.uploading')}</p>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className={styles.uploadContent}>
            <div className={styles.uploadIcon}>
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            <p className={styles.uploadText}>
              {t('booking.dragDropImages')}
            </p>
            <p className={styles.uploadSubtext}>
              {t('booking.orClickToSelect')}
            </p>
            <p className={styles.uploadHint}>
              {t('booking.supportedFormats')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
