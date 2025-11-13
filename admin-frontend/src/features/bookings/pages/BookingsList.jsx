import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrud } from '../../../hooks/useCrud';
import { bookingsCrudConfig } from '../../../config/crudConfigs';
import { confirmDelete, showSuccess, showError } from '../../../utils/crudUtils';
import { 
  CrudToolbar, 
  CrudTable, 
  CrudPagination 
} from '../../../components/crud/CrudComponents';
import styles from './BookingsList.module.css';

export default function BookingsList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Sử dụng CRUD hook với config cho bookings
  const {
    items,
    page,
    totalPages,
    loading,
    error,
    filters,
    fetchData,
    search,
    remove
  } = useCrud(bookingsCrudConfig);

  // Handlers
  const handleSearch = () => {
    search({ keyword: filters.keyword });
  };

  const handleView = (id) => {
    navigate(`/admin/bookings/${id}`);
  };

  // Admin không được sửa booking - chỉ được thay đổi status
  // const handleEdit = (id) => {
  //   navigate(`/admin/bookings/edit/${id}`);
  // };

  // Admin không được xóa booking - chỉ được hủy booking
  // const handleDelete = async (id) => {
  //   const booking = items.find(b => b.id === id);
  //   const confirmMessage = bookingsCrudConfig.deleteConfirmMessage(booking);
  //   
  //   if (confirmDelete(t('bookings.title'), id)) {
  //     try {
  //       await remove(id);
  //       showSuccess(t('common.success'));
  //     } catch (error) {
  //       console.error('Failed to delete booking:', error);
  //       showError(error.response?.data?.error || t('common.error'));
  //     }
  //   }
  // };

  const handleCancelBooking = async (id) => {
    const booking = items.find(b => b.id === id);
    const reason = prompt(`Nhập lý do hủy booking "${booking?.bookingCode || id}":`);
    
    if (reason) {
      try {
        // Call API to cancel booking
        const response = await fetch(`/api/admin/bookings/${id}/cancel`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason })
        });
        
        if (response.ok) {
          showSuccess('Hủy booking thành công');
          fetchData(); // Refresh list
        } else {
          showError('Hủy booking thất bại');
        }
      } catch (error) {
        console.error('Failed to cancel booking:', error);
        showError(error.message || t('common.error'));
      }
    }
  };

  const handleRefundBooking = async (id) => {
    const booking = items.find(b => b.id === id);
    const amount = prompt(`Nhập số tiền hoàn cho booking "${booking?.bookingCode || id}":`);
    const reason = prompt(`Nhập lý do hoàn tiền:`);
    
    if (amount && reason) {
      try {
        // Call API to refund booking
        const response = await fetch(`/api/admin/bookings/${id}/refund`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: parseFloat(amount), reason })
        });
        
        if (response.ok) {
          showSuccess('Hoàn tiền thành công');
          fetchData(); // Refresh list
        } else {
          showError('Hoàn tiền thất bại');
        }
      } catch (error) {
        console.error('Failed to refund booking:', error);
        showError(error.message || t('common.error'));
      }
    }
  };

  const handlePageChange = (newPage) => {
    fetchData({ page: newPage });
  };

  return (
    <div className={styles.bookingsPage}>
      <div className="content-header">
        <h1>{t('bookings.title')}</h1>
        <p>{t('bookings.list')}</p>
      </div>

      <CrudToolbar
        searchPlaceholder={bookingsCrudConfig.searchPlaceholder}
        // Admin không được tạo booking mới
        // createButtonText={bookingsCrudConfig.createButtonText}
        // createPath={bookingsCrudConfig.createPath}
        onSearch={handleSearch}
        searchValue={filters.keyword}
        onSearchChange={(value) => search({ keyword: value })}
      />

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className={styles.tableContainer}>
        <CrudTable
          columns={bookingsCrudConfig.columns}
          data={items}
          loading={loading}
          onView={handleView}
          // Admin không được sửa/xóa booking
          // onEdit={handleEdit}
          // onDelete={handleDelete}
          emptyMessage="Không có booking nào"
        />
        
        {/* Custom action buttons for booking management */}
        {items.length > 0 && (
          <div className={styles.actionButtons}>
            <button 
              className={styles.cancelBtn}
              onClick={() => {
                const selectedId = prompt('Nhập ID booking cần hủy:');
                if (selectedId) handleCancelBooking(parseInt(selectedId));
              }}
            >
              Hủy Booking
            </button>
            <button 
              className={styles.refundBtn}
              onClick={() => {
                const selectedId = prompt('Nhập ID booking cần hoàn tiền:');
                if (selectedId) handleRefundBooking(parseInt(selectedId));
              }}
            >
              Hoàn Tiền
            </button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <CrudPagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
