import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';
import styles from './UserDetail.module.css';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/users/${id}`);
        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleBack = () => {
    navigate('/admin/users');
  };

  const handleEdit = () => {
    navigate(`/admin/users/edit/${id}`);
  };

  if (loading) {
    return (
      <div className={styles.userDetailPage}>
        <div className="content-header">
          <h1>Chi tiết người dùng</h1>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.userDetailPage}>
        <div className="content-header">
          <h1>Chi tiết người dùng</h1>
          <p>{error || 'Không tìm thấy người dùng'}</p>
        </div>
        <button onClick={handleBack} className={styles.backButton}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className={styles.userDetailPage}>
      <div className="content-header">
        <h1>Chi tiết người dùng</h1>
        <p>Thông tin chi tiết của người dùng</p>
      </div>

      <div className={styles.userInfo}>
        <div className={styles.infoCard}>
          <h3>Thông tin cơ bản</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>ID:</label>
              <span>{user.id}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Username:</label>
              <span>{user.username}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Họ tên:</label>
              <span>{user.fullName}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Trạng thái:</label>
              <span className={`${styles.status} ${styles[user.status?.toLowerCase()]}`}>
                {user.status}
              </span>
            </div>
            <div className={styles.infoItem}>
              <label>Số điện thoại:</label>
              <span>{user.phoneNumber || 'Chưa cập nhật'}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Địa chỉ:</label>
              <span>{user.address || 'Chưa cập nhật'}</span>
            </div>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h3>Thông tin quyền</h3>
          <div className={styles.rolesList}>
            {(user.roleNames || user.roles || []).map((role, index) => (
              <span key={index} className={styles.roleTag}>
                {role}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.infoCard}>
          <h3>Thông tin thời gian</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Ngày tạo:</label>
              <span>{user.createdAt ? new Date(user.createdAt).toLocaleString('vi-VN') : 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Cập nhật lần cuối:</label>
              <span>{user.updatedAt ? new Date(user.updatedAt).toLocaleString('vi-VN') : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={handleBack} className={styles.backButton}>
          <i className="fas fa-arrow-left"></i>
          Quay lại
        </button>
        <button onClick={handleEdit} className={styles.editButton}>
          <i className="fas fa-edit"></i>
          Chỉnh sửa
        </button>
      </div>
    </div>
  );
}
