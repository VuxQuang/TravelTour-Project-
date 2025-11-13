import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { promotionsCrudConfig } from '../../../config/crudConfigs';
import { showSuccess, showError } from '../../../utils/crudUtils';
import { CrudForm, CrudFormField } from '../../../components/crud/CrudComponents';
import styles from './CreatePromotion.module.css';

export default function CreatePromotion() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const {
    form,
    setForm,
    submitting,
    formError,
    create
  } = useCrud(promotionsCrudConfig);

  const [discountType, setDiscountType] = useState('PERCENTAGE');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await create(form);
      showSuccess(t('promotions.createSuccess'));
      navigate('/admin/promotions');
    } catch (error) {
      console.error('Failed to create promotion:', error);
      showError(error.response?.data?.error || t('common.error'));
    }
  };

  const handleCancel = () => {
    navigate('/admin/promotions');
  };

  const handleFieldChange = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'discountType') {
      setDiscountType(value);
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm(prev => ({ ...prev, code: result }));
  };

  const discountTypeOptions = [
    { value: 'PERCENTAGE', label: 'Phần trăm (%)' },
    { value: 'FIXED_AMOUNT', label: 'Số tiền cố định (VNĐ)' }
  ];

  const statusOptions = [
    { value: 'ACTIVE', label: 'Hoạt động' },
    { value: 'INACTIVE', label: 'Không hoạt động' }
  ];

  return (
    <div className={styles.createPromotionPage}>
      <CrudForm
        title={t('promotions.create')}
        subtitle={t('promotions.createSubtitle')}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={formError}
        onCancel={handleCancel}
        submitText={t('common.save')}
        cancelText={t('common.cancel')}
      >
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <CrudFormField
              label={t('promotions.code')}
              name="code"
              type="text"
              value={form.code}
              onChange={handleFieldChange}
              required
              placeholder={t('promotions.codePlaceholder')}
            />
            <button 
              type="button" 
              className={styles.generateBtn}
              onClick={generateCode}
            >
              Tạo mã tự động
            </button>
          </div>

          <CrudFormField
            label={t('promotions.title')}
            name="title"
            type="text"
            value={form.title}
            onChange={handleFieldChange}
            required
            placeholder={t('promotions.titlePlaceholder')}
          />
        </div>

        <CrudFormField
          label={t('promotions.description')}
          name="description"
          type="textarea"
          value={form.description}
          onChange={handleFieldChange}
          placeholder={t('promotions.descriptionPlaceholder')}
        />

        <div className={styles.formGrid}>
          <CrudFormField
            label={t('promotions.discountType')}
            name="discountType"
            type="select"
            value={form.discountType}
            onChange={handleFieldChange}
            required
            options={discountTypeOptions}
          />

          <CrudFormField
            label={t('promotions.discountValue')}
            name="discountValue"
            type="number"
            value={form.discountValue}
            onChange={handleFieldChange}
            required
            placeholder={discountType === 'PERCENTAGE' ? '10' : '100000'}
            min="0"
            max={discountType === 'PERCENTAGE' ? '100' : undefined}
          />
        </div>

        <div className={styles.formGrid}>
          <CrudFormField
            label={t('promotions.minOrderAmount')}
            name="minOrderAmount"
            type="number"
            value={form.minOrderAmount}
            onChange={handleFieldChange}
            placeholder="0"
            min="0"
          />

          {discountType === 'PERCENTAGE' && (
            <CrudFormField
              label={t('promotions.maxDiscountAmount')}
              name="maxDiscountAmount"
              type="number"
              value={form.maxDiscountAmount}
              onChange={handleFieldChange}
              placeholder="Không giới hạn"
              min="0"
            />
          )}
        </div>

        <div className={styles.formGrid}>
          <CrudFormField
            label={t('promotions.usageLimit')}
            name="usageLimit"
            type="number"
            value={form.usageLimit}
            onChange={handleFieldChange}
            placeholder="Không giới hạn"
            min="1"
          />

          <CrudFormField
            label={t('promotions.status')}
            name="status"
            type="select"
            value={form.status}
            onChange={handleFieldChange}
            required
            options={statusOptions}
          />
        </div>

        <div className={styles.formGrid}>
          <CrudFormField
            label={t('promotions.startDate')}
            name="startDate"
            type="datetime-local"
            value={form.startDate}
            onChange={handleFieldChange}
          />

          <CrudFormField
            label={t('promotions.endDate')}
            name="endDate"
            type="datetime-local"
            value={form.endDate}
            onChange={handleFieldChange}
          />
        </div>
      </CrudForm>
    </div>
  );
}
