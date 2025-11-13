import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { toursCrudConfig } from '../../../config/crudConfigs';
import { showSuccess, showError } from '../../../utils/crudUtils';
import { CrudForm, CrudFormField } from '../../../components/crud/CrudComponents';
import styles from './CreateTour.module.css';

export default function EditTour() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const {
    form,
    setForm,
    submitting,
    formError,
    update,
    fetchById
  } = useCrud(toursCrudConfig);

  useEffect(() => {
    if (id) {
      fetchById(id);
    }
  }, [id, fetchById]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await update(id, form);
      showSuccess(t('tours.updateSuccess'));
      navigate('/admin/tours');
    } catch (error) {
      console.error('Failed to update tour:', error);
      showError(error.response?.data?.error || t('common.error'));
    }
  };

  const handleCancel = () => {
    navigate('/admin/tours');
  };

  const handleFieldChange = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const statusOptions = [
    { value: 'ACTIVE', label: t('tours.active') },
    { value: 'INACTIVE', label: t('tours.inactive') },
    { value: 'DRAFT', label: t('tours.draft') }
  ];

  // Mock categories - trong thực tế sẽ fetch từ API
  const categoryOptions = [
    { value: 1, label: t('tours.domestic') },
    { value: 2, label: t('tours.international') },
    { value: 3, label: t('tours.resort') },
    { value: 4, label: t('tours.adventure') }
  ];

  return (
    <div className={styles.page}>
      <CrudForm
        title={t('tours.edit')}
        subtitle={t('tours.editSubtitle')}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={formError}
        onCancel={handleCancel}
        submitText={t('common.update')}
        cancelText={t('common.cancel')}
      >
        <div className={styles.formGrid}>
          <CrudFormField
            label={t('tours.title')}
            name="title"
            type="text"
            value={form.title}
            onChange={handleFieldChange}
            required
            placeholder={t('tours.titlePlaceholder')}
          />

          <CrudFormField
            label={t('tours.status')}
            name="status"
            type="select"
            value={form.status}
            onChange={handleFieldChange}
            required
            options={statusOptions}
          />
        </div>

        <CrudFormField
          label={t('tours.description')}
          name="description"
          type="textarea"
          value={form.description}
          onChange={handleFieldChange}
          placeholder={t('tours.descriptionPlaceholder')}
        />

        <div className={styles.formGrid}>
          <CrudFormField
            label={t('tours.price')}
            name="price"
            type="number"
            value={form.price}
            onChange={handleFieldChange}
            required
            placeholder={t('tours.pricePlaceholder')}
          />

          <CrudFormField
            label={t('tours.duration')}
            name="duration"
            type="number"
            value={form.duration}
            onChange={handleFieldChange}
            required
            placeholder={t('tours.durationPlaceholder')}
          />
        </div>

        <div className={styles.formGrid}>
          <CrudFormField
            label={t('tours.maxParticipants')}
            name="maxParticipants"
            type="number"
            value={form.maxParticipants}
            onChange={handleFieldChange}
            required
            placeholder={t('tours.maxParticipantsPlaceholder')}
          />

          <CrudFormField
            label={t('tours.category')}
            name="categoryId"
            type="select"
            value={form.categoryId}
            onChange={handleFieldChange}
            options={[
              { value: '', label: t('tours.selectCategory') },
              ...categoryOptions
            ]}
          />
        </div>

        <CrudFormField
          label={t('tours.location')}
          name="location"
          type="text"
          value={form.location}
          onChange={handleFieldChange}
          required
          placeholder={t('tours.locationPlaceholder')}
        />

        <div className={styles.formGrid}>
          <CrudFormField
            label={t('tours.startDate')}
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleFieldChange}
          />

          <CrudFormField
            label={t('tours.endDate')}
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleFieldChange}
          />
        </div>
      </CrudForm>
    </div>
  );
}
