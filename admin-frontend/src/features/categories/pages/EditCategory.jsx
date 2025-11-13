import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { categoriesCrudConfig } from '../../../config/crudConfigs';
import { showSuccess, showError } from '../../../utils/crudUtils';
import { CrudForm, CrudFormField } from '../../../components/crud/CrudComponents';
import styles from './EditCategory.module.css';

export default function EditCategory() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const {
    form,
    setForm,
    submitting,
    formError,
    fetchDetail,
    update
  } = useCrud(categoriesCrudConfig);

  useEffect(() => {
    if (id) {
      fetchDetail(id).then(data => {
        setForm(data);
      }).catch(error => {
        console.error('Failed to fetch category:', error);
        showError(error.response?.data?.error || t('common.error'));
      });
    }
  }, [id, fetchDetail, setForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await update(id, form);
      showSuccess(t('categories.updateSuccess'));
      navigate('/admin/categories');
    } catch (error) {
      console.error('Failed to update category:', error);
      showError(error.response?.data?.error || t('common.error'));
    }
  };

  const handleCancel = () => {
    navigate('/admin/categories');
  };

  const handleFieldChange = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.editCategoryPage}>
      <CrudForm
        title={t('categories.edit')}
        subtitle={t('categories.editSubtitle')}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={formError}
        onCancel={handleCancel}
        submitText={t('common.save')}
        cancelText={t('common.cancel')}
      >
        <div className={styles.formGrid}>
          <CrudFormField
            label={t('categories.name')}
            name="name"
            type="text"
            value={form.name}
            onChange={handleFieldChange}
            required
            placeholder={t('categories.namePlaceholder')}
          />

          <CrudFormField
            label={t('categories.description')}
            name="description"
            type="textarea"
            value={form.description}
            onChange={handleFieldChange}
            placeholder={t('categories.descriptionPlaceholder')}
          />

          <CrudFormField
            label={t('categories.status')}
            name="status"
            type="select"
            value={form.status}
            onChange={handleFieldChange}
            required
            options={[
              { value: 'ACTIVE', label: t('categories.statusActive') },
              { value: 'INACTIVE', label: t('categories.statusInactive') }
            ]}
          />

          <CrudFormField
            label={t('categories.parentId')}
            name="parentId"
            type="select"
            value={form.parentId}
            onChange={handleFieldChange}
            options={[
              { value: '', label: t('categories.selectParent') },
              { value: '1', label: 'Du lịch trong nước' },
              { value: '2', label: 'Du lịch nước ngoài' },
              { value: '3', label: 'Du lịch nghỉ dưỡng' }
            ]}
          />
        </div>
      </CrudForm>
    </div>
  );
}
