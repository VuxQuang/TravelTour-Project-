import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { usersCrudConfig } from '../../../config/crudConfigs';
import { CrudForm, CrudFormField } from '../../../components/crud/CrudComponents';
import styles from './CreateUser.module.css';

export default function CreateUser() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const {
    form,
    setForm,
    submitting,
    formError,
    create,
    resetForm
  } = useCrud(usersCrudConfig);

  const handleFieldChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    try {
      await create(form);
      navigate('/admin/users', { replace: true });
    } catch (error) {
      console.error('Create user error:', error);
    }
  };

  const handleCancel = () => {
    navigate('/admin/users');
  };

  const roleOptions = [
    { value: 'ROLE_USER', label: 'ROLE_USER' },
    { value: 'ROLE_STAFF', label: 'ROLE_STAFF' },
    { value: 'ROLE_ADMIN', label: 'ROLE_ADMIN' }
  ];

  return (
    <div className={styles.page}>
      <CrudForm
        title={t('users.create')}
        subtitle="Nhập thông tin người dùng mới"
        onSubmit={handleSubmit}
        submitting={submitting}
        error={formError}
        onCancel={handleCancel}
        submitText={t('common.save')}
        cancelText={t('common.cancel')}
      >
        <CrudFormField
          label={t('login.username')}
          name="username"
          value={form.username}
          onChange={handleFieldChange}
          required
        />
        
        <CrudFormField
          label={t('users.email')}
          name="email"
          type="email"
          value={form.email}
          onChange={handleFieldChange}
          required
        />
        
        <CrudFormField
          label={t('users.name')}
          name="fullName"
          value={form.fullName}
          onChange={handleFieldChange}
        />
        
        <CrudFormField
          label={t('login.password')}
          name="password"
          type="password"
          value={form.password}
          onChange={handleFieldChange}
          required
        />
        
        <div className={styles.row}>
          <div style={{ flex: 1 }}>
            <CrudFormField
              label={t('users.phone')}
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleFieldChange}
            />
          </div>
          <div style={{ flex: 1 }}>
            <CrudFormField
              label={t('users.role')}
              name="roleName"
              type="select"
              value={form.roleName}
              onChange={handleFieldChange}
              options={roleOptions}
            />
          </div>
        </div>
        
        <CrudFormField
          label="Địa chỉ"
          name="address"
          value={form.address}
          onChange={handleFieldChange}
        />
      </CrudForm>
    </div>
  );
}


