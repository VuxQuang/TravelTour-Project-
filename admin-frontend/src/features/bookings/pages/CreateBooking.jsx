import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { bookingsCrudConfig } from '../../../config/crudConfigs';
import { showSuccess, showError } from '../../../utils/crudUtils';
import { CrudForm, CrudFormField } from '../../../components/crud/CrudComponents';
import styles from './CreateBooking.module.css';

export default function CreateBooking() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const {
    form,
    setForm,
    submitting,
    formError,
    create
  } = useCrud(bookingsCrudConfig);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await create(form);
      showSuccess(t('bookings.createSuccess'));
      navigate('/admin/bookings');
    } catch (error) {
      console.error('Failed to create booking:', error);
      showError(error.response?.data?.error || t('common.error'));
    }
  };

  const handleCancel = () => {
    navigate('/admin/bookings');
  };

  const handleFieldChange = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.createBookingPage}>
      <CrudForm
        title={t('bookings.create')}
        subtitle={t('bookings.createSubtitle')}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={formError}
        onCancel={handleCancel}
        submitText={t('common.save')}
        cancelText={t('common.cancel')}
      >
        <div className={styles.formGrid}>
          <CrudFormField
            label={t('bookings.tourId')}
            name="tourId"
            type="select"
            value={form.tourId}
            onChange={handleFieldChange}
            required
            options={[
              { value: '', label: t('bookings.selectTour') },
              { value: '1', label: 'Tour Hà Nội - Sapa' },
              { value: '2', label: 'Tour Đà Nẵng - Hội An' },
              { value: '3', label: 'Tour TP.HCM - Mekong' }
            ]}
          />

          <CrudFormField
            label={t('bookings.userId')}
            name="userId"
            type="select"
            value={form.userId}
            onChange={handleFieldChange}
            required
            options={[
              { value: '', label: t('bookings.selectUser') },
              { value: '1', label: 'Nguyễn Văn A' },
              { value: '2', label: 'Trần Thị B' },
              { value: '3', label: 'Lê Văn C' }
            ]}
          />

          <CrudFormField
            label={t('bookings.participants')}
            name="participants"
            type="number"
            value={form.participants}
            onChange={handleFieldChange}
            required
            placeholder="1"
          />

          <CrudFormField
            label={t('bookings.totalPrice')}
            name="totalPrice"
            type="number"
            value={form.totalPrice}
            onChange={handleFieldChange}
            required
            placeholder="0"
          />

          <CrudFormField
            label={t('bookings.status')}
            name="status"
            type="select"
            value={form.status}
            onChange={handleFieldChange}
            required
            options={[
              { value: 'PENDING', label: t('bookings.statusPending') },
              { value: 'CONFIRMED', label: t('bookings.statusConfirmed') },
              { value: 'CANCELLED', label: t('bookings.statusCancelled') },
              { value: 'COMPLETED', label: t('bookings.statusCompleted') }
            ]}
          />

          <CrudFormField
            label={t('bookings.notes')}
            name="notes"
            type="textarea"
            value={form.notes}
            onChange={handleFieldChange}
            placeholder={t('bookings.notesPlaceholder')}
          />
        </div>
      </CrudForm>
    </div>
  );
}
