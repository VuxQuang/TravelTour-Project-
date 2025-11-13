import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { scheduleCrudConfig } from '../../../config/crudConfigs';
import { showSuccess, showError } from '../../../utils/crudUtils';
import { CrudForm, CrudFormField } from '../../../components/crud/CrudComponents';
import styles from './CreateSchedule.module.css';

export default function CreateSchedule() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const {
    form,
    setForm,
    submitting,
    formError,
    create
  } = useCrud(scheduleCrudConfig);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await create(form);
      showSuccess(t('schedule.createSuccess'));
      navigate('/admin/schedule');
    } catch (error) {
      console.error('Failed to create schedule:', error);
      showError(error.response?.data?.error || t('common.error'));
    }
  };

  const handleCancel = () => {
    navigate('/admin/schedule');
  };

  const handleFieldChange = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.createSchedulePage}>
      <CrudForm
        title={t('schedule.create')}
        subtitle={t('schedule.createSubtitle')}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={formError}
        onCancel={handleCancel}
        submitText={t('common.save')}
        cancelText={t('common.cancel')}
      >
        <div className={styles.formGrid}>
          <CrudFormField
            label={t('schedule.tourId')}
            name="tourId"
            type="select"
            value={form.tourId}
            onChange={handleFieldChange}
            required
            options={[
              { value: '', label: t('schedule.selectTour') },
              { value: '1', label: 'Tour Hà Nội - Sapa' },
              { value: '2', label: 'Tour Đà Nẵng - Hội An' },
              { value: '3', label: 'Tour TP.HCM - Mekong' }
            ]}
          />

          <CrudFormField
            label={t('schedule.title')}
            name="title"
            type="text"
            value={form.title}
            onChange={handleFieldChange}
            required
            placeholder={t('schedule.titlePlaceholder')}
          />

          <CrudFormField
            label={t('schedule.startDate')}
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleFieldChange}
            required
          />

          <CrudFormField
            label={t('schedule.endDate')}
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleFieldChange}
            required
          />

          <CrudFormField
            label={t('schedule.startTime')}
            name="startTime"
            type="time"
            value={form.startTime}
            onChange={handleFieldChange}
            required
          />

          <CrudFormField
            label={t('schedule.endTime')}
            name="endTime"
            type="time"
            value={form.endTime}
            onChange={handleFieldChange}
            required
          />

          <CrudFormField
            label={t('schedule.location')}
            name="location"
            type="text"
            value={form.location}
            onChange={handleFieldChange}
            required
            placeholder={t('schedule.locationPlaceholder')}
          />

          <CrudFormField
            label={t('schedule.description')}
            name="description"
            type="textarea"
            value={form.description}
            onChange={handleFieldChange}
            placeholder={t('schedule.descriptionPlaceholder')}
          />

          <CrudFormField
            label={t('schedule.status')}
            name="status"
            type="select"
            value={form.status}
            onChange={handleFieldChange}
            required
            options={[
              { value: 'SCHEDULED', label: t('schedule.statusScheduled') },
              { value: 'IN_PROGRESS', label: t('schedule.statusInProgress') },
              { value: 'COMPLETED', label: t('schedule.statusCompleted') },
              { value: 'CANCELLED', label: t('schedule.statusCancelled') }
            ]}
          />
        </div>
      </CrudForm>
    </div>
  );
}
