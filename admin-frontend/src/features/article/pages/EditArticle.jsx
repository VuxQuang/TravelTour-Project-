import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCrud } from '../../../hooks/useCrud';
import { articlesCrudConfig } from '../../../config/crudConfigs';
import { CrudForm, CrudFormField } from '../../../components/crud/CrudComponents';
import { showSuccess, showError } from '../../../utils/crudUtils';
import { api } from '../../../lib/api';
import styles from './Article.module.css';

export default function EditArticle() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Sử dụng CRUD hook với config cho articles
  const {
    form,
    setForm,
    submitting,
    formError,
    update,
    fetchDetail,
    detailLoading
  } = useCrud(articlesCrudConfig);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Load article data
    fetchDetail(id)
      .then(articleData => {
        setForm({
          title: articleData.title || '',
          content: articleData.content || '',
          summary: articleData.summary || '',
          status: articleData.status || 'ACTIVE',
          categoryId: articleData.categoryId || null,
          tags: articleData.tags || '',
          featuredImage: articleData.featuredImage || ''
        });
      })
      .catch(() => {
        console.error('Failed to load article data');
        showError('Không thể tải dữ liệu bài viết');
      });

    // Load categories
    loadCategories();
  }, [id, fetchDetail, setForm]);

  const loadCategories = async () => {
    try {
      const response = await api.get('/admin/articles/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Fallback to mock data if API fails
      setCategories([
        { value: 1, label: 'Tin tức du lịch' },
        { value: 2, label: 'Hướng dẫn du lịch' },
        { value: 3, label: 'Đánh giá địa điểm' },
        { value: 4, label: 'Kinh nghiệm du lịch' }
      ]);
    }
  };

  const handleFieldChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await update(id, form);
      showSuccess('Cập nhật bài viết thành công!');
      navigate('/admin/articles');
    } catch (error) {
      console.error('Failed to update article:', error);
      showError(error.response?.data?.error || 'Cập nhật bài viết thất bại.');
    }
  };

  const handleCancel = () => {
    navigate('/admin/articles');
  };

  if (detailLoading) {
    return (
      <div className={styles.articleFormPage}>
        <div className="content-header">
          <h1>Đang tải...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.articleFormPage}>
      <div className="content-header">
        <h1>Chỉnh sửa bài viết</h1>
        <p>Cập nhật thông tin bài viết</p>
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

          <CrudFormField
            label="Trạng thái"
            name="status"
            type="select"
            value={form.status}
            onChange={(value) => handleFieldChange('status', value)}
            options={[
              { value: 'ACTIVE', label: 'Hoạt động' },
              { value: 'INACTIVE', label: 'Không hoạt động' }
            ]}
          />

          <CrudFormField
            label="Danh mục"
            name="categoryId"
            type="select"
            value={form.categoryId || ''}
            onChange={(value) => handleFieldChange('categoryId', value)}
            options={categories}
            placeholder="Chọn danh mục"
          />

          <CrudFormField
            label="Tags"
            name="tags"
            type="text"
            value={form.tags}
            onChange={(value) => handleFieldChange('tags', value)}
            placeholder="Nhập tags cách nhau bằng dấu phẩy"
          />

          <CrudFormField
            label="Hình ảnh đại diện"
            name="featuredImage"
            type="text"
            value={form.featuredImage}
            onChange={(value) => handleFieldChange('featuredImage', value)}
            placeholder="Nhập URL hình ảnh"
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
              {submitting ? 'Đang cập nhật...' : 'Cập nhật bài viết'}
            </button>
          </div>
        </CrudForm>
      </div>
    </div>
  );
}