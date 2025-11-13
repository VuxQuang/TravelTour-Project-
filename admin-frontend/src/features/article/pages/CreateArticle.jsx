import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrud } from '../../../hooks/useCrud';
import { articlesCrudConfig } from '../../../config/crudConfigs';
import { CrudForm, CrudFormField } from '../../../components/crud/CrudComponents';
import { showSuccess, showError } from '../../../utils/crudUtils';
import { api } from '../../../lib/api';
import styles from './Article.module.css';

export default function CreateArticle() {
  const navigate = useNavigate();
  
  // Sử dụng CRUD hook với config cho articles
  const {
    form,
    setForm,
    submitting,
    formError,
    create
  } = useCrud(articlesCrudConfig);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Không cần load categories nữa
  }, []);

  const handleFieldChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Form data before submit:', form);
      console.log('Title:', form.title);
      console.log('Content:', form.content);
      console.log('Summary:', form.summary);
      
      await create(form);
      showSuccess('Tạo bài viết thành công!');
      navigate('/admin/articles');
    } catch (error) {
      console.error('Failed to create article:', error);
      console.error('Error response:', error.response?.data);
      showError(error.response?.data?.error || 'Tạo bài viết thất bại.');
    }
  };

  const handleCancel = () => {
    navigate('/admin/articles');
  };

  return (
    <div className={styles.articleFormPage}>
      <div className="content-header">
        <h1>Tạo bài viết mới</h1>
        <p>Nhập thông tin bài viết</p>
      </div>

      <div className="form-container">
        <CrudForm onSubmit={handleSubmit} submitting={submitting}>
          <CrudFormField
            label="Tiêu đề bài viết"
            name="title"
            type="text"
            value={form.title}
            onChange={(value) => handleFieldChange('title', value)}
            required
            placeholder="Nhập tiêu đề bài viết"
          />

          <CrudFormField
            label="Tóm tắt"
            name="summary"
            type="textarea"
            value={form.summary}
            onChange={(value) => handleFieldChange('summary', value)}
            placeholder="Nhập tóm tắt bài viết"
            rows={3}
          />

          <CrudFormField
            label="Nội dung"
            name="content"
            type="textarea"
            value={form.content}
            onChange={(value) => handleFieldChange('content', value)}
            required
            placeholder="Nhập nội dung bài viết"
            rows={10}
          />

          {formError && (
            <div className="form-error">
              <strong>Lỗi:</strong> {formError}
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Đang tạo...' : 'Tạo bài viết'}
            </button>
          </div>
        </CrudForm>
      </div>
    </div>
  );
}
