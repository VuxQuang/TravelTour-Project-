import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCrud } from '../../../hooks/useCrud';
import { usersCrudConfig } from '../../../config/crudConfigs';
import { CrudForm, CrudFormField } from '../../../components/crud/CrudComponents';
import styles from './EditUser.module.css';

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Sử dụng CRUD hook với config cho users
  const {
    form,
    setForm,
    submitting,
    formError,
    update,
    fetchDetail,
    detailLoading
  } = useCrud(usersCrudConfig);

  const [roles, setRoles] = useState([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Load user data
    fetchDetail(id)
      .then(userData => {
        setForm({
          username: userData.username || '',
          email: userData.email || '',
          password: '', // Don't pre-fill password
          fullName: userData.fullName || '',
          phoneNumber: userData.phoneNumber || '',
          address: userData.address || '',
          roleName: (userData.roleNames || userData.roles || [])[0] || 'ROLE_USER',
          status: userData.status || 'ACTIVE'
        });
      })
      .catch(() => {
        console.error('Failed to load user data');
      });

    // Load roles (you might want to move this to a separate API call)
    setRoles([
      { roleId: 1, roleName: 'ROLE_USER' },
      { roleId: 2, roleName: 'ROLE_STAFF' },
      { roleId: 3, roleName: 'ROLE_ADMIN' },
    ]);
  }, [id, fetchDetail, setForm]);

  const handleFieldChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    try {
      await update(id, form);
      setSuccess('Cập nhật người dùng thành công!');
      setTimeout(() => {
        navigate('/admin/users', { replace: true });
      }, 1500);
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const handleCancel = () => {
    navigate('/admin/users');
  };

  const roleOptions = roles.map(role => ({
    value: role.roleName,
    label: role.roleName
  }));

  const statusOptions = [
    { value: 'ACTIVE', label: 'ACTIVE' },
    { value: 'INACTIVE', label: 'INACTIVE' },
    { value: 'PENDING', label: 'PENDING' }
  ];

  if (detailLoading) {
    return (
      <div className={styles.editUserPage}>
        <div className="content-header">
          <h1>Chỉnh sửa người dùng</h1>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.editUserPage}>
      <CrudForm
        title="Chỉnh sửa người dùng"
        subtitle="Cập nhật thông tin người dùng"
        onSubmit={handleSubmit}
        submitting={submitting}
        error={formError}
        success={success}
        onCancel={handleCancel}
        submitText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <CrudFormField
          label="Username"
          name="username"
          value={form.username}
          onChange={handleFieldChange}
          disabled
        />
        
        <CrudFormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleFieldChange}
          required
        />
        
        <CrudFormField
          label="Mật khẩu (để trống nếu không đổi)"
          name="password"
          type="password"
          value={form.password}
          onChange={handleFieldChange}
        />
        
        <CrudFormField
          label="Họ tên"
          name="fullName"
          value={form.fullName}
          onChange={handleFieldChange}
          required
        />
        
        <CrudFormField
          label="Số điện thoại"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleFieldChange}
        />
        
        <CrudFormField
          label="Địa chỉ"
          name="address"
          value={form.address}
          onChange={handleFieldChange}
        />
        
        <CrudFormField
          label="Trạng thái"
          name="status"
          type="select"
          value={form.status}
          onChange={handleFieldChange}
          options={statusOptions}
        />
        
        <CrudFormField
          label="Quyền"
          name="roleName"
          type="select"
          value={form.roleName}
          onChange={handleFieldChange}
          options={roleOptions}
        />
      </CrudForm>
    </div>
  );
}
