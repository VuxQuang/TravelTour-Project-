package fsa.training.travelee.repository;

import fsa.training.travelee.entity.booking.BookingImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingImageRepository extends JpaRepository<BookingImage, Long> {
    
    // Lấy tất cả hình ảnh của booking
    List<BookingImage> findByBookingIdOrderByCreatedAtDesc(Long bookingId);
    
    // Lấy hình ảnh chính của booking
    Optional<BookingImage> findByBookingIdAndIsPrimaryTrue(Long bookingId);
    
    // Đếm số hình ảnh của booking
    long countByBookingId(Long bookingId);
    
    // Xóa tất cả hình ảnh của booking
    void deleteByBookingId(Long bookingId);
    
    // Lấy hình ảnh theo URL
    Optional<BookingImage> findByImageUrl(String imageUrl);
    
    // Tìm kiếm hình ảnh theo tên
    @Query("SELECT bi FROM BookingImage bi WHERE bi.booking.id = :bookingId AND LOWER(bi.imageName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<BookingImage> findByBookingIdAndImageNameContaining(@Param("bookingId") Long bookingId, @Param("keyword") String keyword);
}
