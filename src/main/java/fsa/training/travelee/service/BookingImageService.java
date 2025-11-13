package fsa.training.travelee.service;

import fsa.training.travelee.entity.booking.BookingImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BookingImageService {
    
    // Upload hình ảnh cho booking
    BookingImage uploadBookingImage(Long bookingId, MultipartFile file, String description, String uploadedBy);
    
    // Lấy tất cả hình ảnh của booking
    List<BookingImage> getBookingImages(Long bookingId);
    
    // Lấy hình ảnh theo ID
    BookingImage getBookingImageById(Long imageId);
    
    // Xóa hình ảnh
    void deleteBookingImage(Long imageId);
    
    // Xóa tất cả hình ảnh của booking
    void deleteAllBookingImages(Long bookingId);
    
    // Đặt hình ảnh làm hình chính
    BookingImage setPrimaryImage(Long imageId);
    
    // Lấy hình ảnh chính của booking
    BookingImage getPrimaryBookingImage(Long bookingId);
    
    // Cập nhật mô tả hình ảnh
    BookingImage updateImageDescription(Long imageId, String description);
    
    // Lấy hình ảnh với phân trang
    Page<BookingImage> getBookingImagesWithPagination(Long bookingId, Pageable pageable);
    
    // Tìm kiếm hình ảnh theo tên
    List<BookingImage> searchBookingImages(Long bookingId, String keyword);
    
    // Upload nhiều hình ảnh cùng lúc
    List<BookingImage> uploadMultipleBookingImages(Long bookingId, MultipartFile[] files, String uploadedBy);
    
    // Kiểm tra quyền upload hình ảnh
    boolean canUploadImage(Long bookingId, String username);
    
    // Lấy thống kê hình ảnh
    long getImageCount(Long bookingId);
    
    // Lấy tổng dung lượng hình ảnh của booking
    long getTotalImageSize(Long bookingId);
}
