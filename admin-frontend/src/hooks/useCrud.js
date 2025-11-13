import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

export function useCrud(config) {
  const {
    baseUrl,
    defaultForm = {},
    transformData = (data) => data,
    transformForm = (form) => form,
    defaultFilters = {}
  } = config;

  // State cho list
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State cho filters
  const [filters, setFilters] = useState(defaultFilters);

  // State cho form
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // State cho detail
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch danh sách
  const fetchData = useCallback(async (opts = {}) => {
    const params = { 
      page, 
      size, 
      ...filters, 
      ...opts 
    };
    
    setLoading(true);
    setError('');
    
    try {
      const res = await api.get(baseUrl, { params });
      const data = res.data;
      
      setItems(transformData(data.items || []));
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
      setPage(data.page ?? params.page ?? 0);
      setSize(data.size ?? params.size ?? 10);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi tải dữ liệu');
      console.error('Fetch data error:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, page, size, filters, transformData]);

  // Fetch chi tiết
  const fetchDetail = useCallback(async (id) => {
    setDetailLoading(true);
    setError('');
    
    try {
      const res = await api.get(`${baseUrl}/${id}`);
      setDetail(transformData(res.data));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi tải chi tiết');
      console.error('Fetch detail error:', err);
      throw err;
    } finally {
      setDetailLoading(false);
    }
  }, [baseUrl, transformData]);

  // Fetch by ID (alias for fetchDetail)
  const fetchById = useCallback(async (id) => {
    const data = await fetchDetail(id);
    setForm(transformData(data));
    return data;
  }, [fetchDetail, transformData]);

  // Tạo mới
  const create = useCallback(async (formData) => {
    setSubmitting(true);
    setFormError('');
    
    try {
      const transformedData = transformForm(formData);
      const res = await api.post(baseUrl, transformedData);
      await fetchData(); // Refresh list
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Lỗi khi tạo mới';
      setFormError(errorMsg);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [baseUrl, transformForm, fetchData]);

  // Cập nhật
  const update = useCallback(async (id, formData) => {
    setSubmitting(true);
    setFormError('');
    
    try {
      const transformedData = transformForm(formData);
      const res = await api.put(`${baseUrl}/${id}`, transformedData);
      await fetchData(); // Refresh list
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Lỗi khi cập nhật';
      setFormError(errorMsg);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [baseUrl, transformForm, fetchData]);

  // Xóa
  const remove = useCallback(async (id) => {
    try {
      await api.delete(`${baseUrl}/${id}`);
      await fetchData(); // Refresh list
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Lỗi khi xóa';
      setError(errorMsg);
      throw err;
    }
  }, [baseUrl, fetchData]);

  // Search
  const search = useCallback((searchFilters) => {
    setFilters(prev => ({ ...prev, ...searchFilters }));
    setPage(0);
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setForm(defaultForm);
    setFormError('');
  }, [defaultForm]);

  // Set form data
  const setFormData = useCallback((data) => {
    setForm(data);
  }, []);

  // Auto fetch on mount và khi dependencies thay đổi
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    // List state
    items,
    page,
    size,
    totalPages,
    totalElements,
    loading,
    error,
    
    // Filters
    filters,
    setFilters,
    
    // Form state
    form,
    setForm,
    setFormData,
    submitting,
    formError,
    setFormError,
    
    // Detail state
    detail,
    detailLoading,
    
    // Actions
    fetchData,
    fetchDetail,
    fetchById,
    create,
    update,
    remove,
    search,
    resetForm,
    
    // Utils
    setPage,
    setSize
  };
}

/**
 * Hook cho pagination
 */
export function usePagination(totalPages, currentPage, onPageChange) {
  const pages = Array.from({ length: totalPages }, (_, i) => i);
  
  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };
  
  const goToFirst = () => goToPage(0);
  const goToLast = () => goToPage(totalPages - 1);
  const goToPrev = () => goToPage(currentPage - 1);
  const goToNext = () => goToPage(currentPage + 1);
  
  return {
    pages,
    goToPage,
    goToFirst,
    goToLast,
    goToPrev,
    goToNext,
    hasPrev: currentPage > 0,
    hasNext: currentPage < totalPages - 1
  };
}
