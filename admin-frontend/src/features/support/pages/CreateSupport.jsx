import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { supportCrudConfig } from '../../../config/crudConfigs';
import { showSuccess, showError } from '../../../utils/crudUtils';
import { CrudForm, CrudFormField } from '../../../components/crud/CrudComponents';
import styles from './CreateSupport.module.css';

export default function CreateSupport() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const {
    form,
    setForm,
    submitting,
    formError,
    create
  } = useCrud(supportCrudConfig);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await create(form);
      showSuccess(t('support.createSuccess'));
      navigate('/admin/support');
    } catch (error) {
      console.error('Failed to create support:', error);
      showError(error.response?.data?.error || t('common.error'));
    }
  };

  const handleCancel = () => {
    navigate('/admin/support');
  };

  const handleFieldChange = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.createSupportPage}>
      <CrudForm
        title={t('support.create')}
        subtitle={t('support.createSubtitle')}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={formError}
        onCancel={handleCancel}
        submitText={t('common.save')}
        cancelText={t('common.cancel')}
      >
        <div className={styles.formGrid}>
          <CrudFormField
            label={t('support.subject')}
            name="subject"
            type="text"
            value={form.subject}
            onChange={handleFieldChange}
            required
            placeholder={t('support.subjectPlaceholder')}
          />

          <CrudFormField
            label={t('support.category')}
            name="category"
            type="select"
            value={form.category}
            onChange={handleFieldChange}
            required
            options={[
              { value: '', label: t('support.selectCategory') },
              { value: 'TECHNICAL', label: t('support.categoryTechnical') },
              { value: 'BOOKING', label: t('support.categoryBooking') },
              { value: 'PAYMENT', label: t('support.categoryPayment') },
              { value: 'GENERAL', label: t('support.categoryGeneral') }
            ]}
          />

          <CrudFormField
            label={t('support.priority')}
            name="priority"
            type="select"
            value={form.priority}
            onChange={handleFieldChange}
            required
            options={[
              { value: 'LOW', label: t('support.priorityLow') },
              { value: 'MEDIUM', label: t('support.priorityMedium') },
              { value: 'HIGH', label: t('support.priorityHigh') },
              { value: 'URGENT', label: t('support.priorityUrgent') }
            ]}
          />

          <CrudFormField
            label={t('support.status')}
            name="status"
            type="select"
            value={form.status}
            onChange={handleFieldChange}
            required
            options={[
              { value: 'OPEN', label: t('support.statusOpen') },
              { value: 'IN_PROGRESS', label: t('support.statusInProgress') },
              { value: 'RESOLVED', label: t('support.statusResolved') },
              { value: 'CLOSED', label: t('support.statusClosed') }
            ]}
          />

          <CrudFormField
            label={t('support.userId')}
            name="userId"
            type="select"
            value={form.userId}
            onChange={handleFieldChange}
            required
            options={[
              { value: '', label: t('support.selectUser') },
              { value: '1', label: 'Nguyễn Văn A' },
              { value: '2', label: 'Trần Thị B' },
              { value: '3', label: 'Lê Văn C' }
            ]}
          />

          <CrudFormField
            label={t('support.description')}
            name="description"
            type="textarea"
            value={form.description}
            onChange={handleFieldChange}
            required
            placeholder={t('support.descriptionPlaceholder')}
          />

          <CrudFormField
            label={t('support.response')}
            name="response"
            type="textarea"
            value={form.response}
            onChange={handleFieldChange}
            placeholder={t('support.responsePlaceholder')}
          />
        </div>
      </CrudForm>
    </div>
  );
}
