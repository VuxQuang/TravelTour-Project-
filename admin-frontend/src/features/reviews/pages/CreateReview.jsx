import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { reviewsCrudConfig } from '../../../config/crudConfigs';
import { showSuccess, showError } from '../../../utils/crudUtils';
import { CrudForm, CrudFormField } from '../../../components/crud/CrudComponents';
import styles from './CreateReview.module.css';

export default function CreateReview() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const {
    form,
    setForm,
    submitting,
    formError,
    create
  } = useCrud(reviewsCrudConfig);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await create(form);
      showSuccess(t('reviews.createSuccess'));
      navigate('/admin/reviews');
    } catch (error) {
      console.error('Failed to create review:', error);
      showError(error.response?.data?.error || t('common.error'));
    }
  };

  const handleCancel = () => {
    navigate('/admin/reviews');
  };

  const handleFieldChange = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.createReviewPage}>
      <CrudForm
        title={t('reviews.create')}
        subtitle={t('reviews.createSubtitle')}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={formError}
        onCancel={handleCancel}
        submitText={t('common.save')}
        cancelText={t('common.cancel')}
      >
        <div className={styles.formGrid}>
          <CrudFormField
            label={t('reviews.tourId')}
            name="tourId"
            type="select"
            value={form.tourId}
            onChange={handleFieldChange}
            required
            options={[
              { value: '', label: t('reviews.selectTour') },
              { value: '1', label: 'Tour Hà Nội - Sapa' },
              { value: '2', label: 'Tour Đà Nẵng - Hội An' },
              { value: '3', label: 'Tour TP.HCM - Mekong' }
            ]}
          />

          <CrudFormField
            label={t('reviews.userId')}
            name="userId"
            type="select"
            value={form.userId}
            onChange={handleFieldChange}
            required
            options={[
              { value: '', label: t('reviews.selectUser') },
              { value: '1', label: 'Nguyễn Văn A' },
              { value: '2', label: 'Trần Thị B' },
              { value: '3', label: 'Lê Văn C' }
            ]}
          />

          <CrudFormField
            label={t('reviews.rating')}
            name="rating"
            type="select"
            value={form.rating}
            onChange={handleFieldChange}
            required
            options={[
              { value: '', label: t('reviews.selectRating') },
              { value: '1', label: '1 sao' },
              { value: '2', label: '2 sao' },
              { value: '3', label: '3 sao' },
              { value: '4', label: '4 sao' },
              { value: '5', label: '5 sao' }
            ]}
          />

          <CrudFormField
            label={t('reviews.status')}
            name="status"
            type="select"
            value={form.status}
            onChange={handleFieldChange}
            required
            options={[
              { value: 'PENDING', label: t('reviews.statusPending') },
              { value: 'APPROVED', label: t('reviews.statusApproved') },
              { value: 'REJECTED', label: t('reviews.statusRejected') }
            ]}
          />

          <CrudFormField
            label={t('reviews.title')}
            name="title"
            type="text"
            value={form.title}
            onChange={handleFieldChange}
            required
            placeholder={t('reviews.titlePlaceholder')}
          />

          <CrudFormField
            label={t('reviews.comment')}
            name="comment"
            type="textarea"
            value={form.comment}
            onChange={handleFieldChange}
            required
            placeholder={t('reviews.commentPlaceholder')}
          />
        </div>
      </CrudForm>
    </div>
  );
}
