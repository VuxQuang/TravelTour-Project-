package fsa.training.travelee.controller.api;

import fsa.training.travelee.entity.booking.Booking;
import fsa.training.travelee.entity.booking.BookingStatus;
import fsa.training.travelee.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class AdminBookingApiController {

    private final BookingService bookingService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "status", required = false) BookingStatus status,
            @RequestParam(value = "tourId", required = false) Long tourId,
            @RequestParam(value = "userId", required = false) Long userId,
            Pageable pageable
    ) {
        Page<Booking> bookingsPage = bookingService.getAllBookings(
                keyword, status, tourId, userId, pageable
        );
        
        List<Map<String, Object>> items = bookingsPage.getContent().stream().map(booking -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", booking.getId());
            m.put("bookingCode", booking.getBookingCode());
            m.put("adultCount", booking.getAdultCount());
            m.put("childCount", booking.getChildCount());
            m.put("participants", booking.getAdultCount() + booking.getChildCount());
            m.put("totalPrice", booking.getTotalAmount());
            m.put("totalAmount", booking.getTotalAmount());
            m.put("status", booking.getStatus());
            m.put("createdAt", booking.getCreatedAt());
            m.put("specialRequests", booking.getSpecialRequests());
            m.put("notes", booking.getSpecialRequests());
            
            // Tour info
            if (booking.getTour() != null) {
                m.put("tourId", booking.getTour().getId());
                m.put("tourTitle", booking.getTour().getTitle());
                // Lấy hình ảnh chính của tour
                String tourImage = booking.getTour().getImages().stream()
                        .filter(img -> img.getIsPrimary() != null && img.getIsPrimary())
                        .map(img -> img.getImageUrl())
                        .findFirst()
                        .orElse(booking.getTour().getImages().stream()
                                .map(img -> img.getImageUrl())
                                .findFirst()
                                .orElse(null));
                m.put("tourImage", tourImage);
            }
            
            // User info
            if (booking.getUser() != null) {
                m.put("userId", booking.getUser().getId());
                m.put("userName", booking.getUser().getFullName() != null ? 
                    booking.getUser().getFullName() : booking.getUser().getUsername());
            }
            
            return m;
        }).toList();

        Map<String, Object> result = new HashMap<>();
        result.put("items", items);
        result.put("totalPages", bookingsPage.getTotalPages());
        result.put("totalElements", bookingsPage.getTotalElements());
        result.put("page", bookingsPage.getNumber());
        result.put("size", bookingsPage.getSize());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("id", booking.getId());
        result.put("bookingCode", booking.getBookingCode());
        result.put("adultCount", booking.getAdultCount());
        result.put("childCount", booking.getChildCount());
        result.put("participants", booking.getAdultCount() + booking.getChildCount());
        result.put("totalPrice", booking.getTotalAmount());
        result.put("totalAmount", booking.getTotalAmount());
        result.put("status", booking.getStatus());
        result.put("createdAt", booking.getCreatedAt());
        result.put("updatedAt", booking.getUpdatedAt());
        result.put("specialRequests", booking.getSpecialRequests());
        result.put("notes", booking.getSpecialRequests());
        
        // Tour info
        if (booking.getTour() != null) {
            result.put("tourId", booking.getTour().getId());
            result.put("tourTitle", booking.getTour().getTitle());
            // Lấy hình ảnh chính của tour
            String tourImage = booking.getTour().getImages().stream()
                    .filter(img -> img.getIsPrimary() != null && img.getIsPrimary())
                    .map(img -> img.getImageUrl())
                    .findFirst()
                    .orElse(booking.getTour().getImages().stream()
                            .map(img -> img.getImageUrl())
                            .findFirst()
                            .orElse(null));
            result.put("tourImage", tourImage);
        }
        
        // User info
        if (booking.getUser() != null) {
            result.put("userId", booking.getUser().getId());
            result.put("userName", booking.getUser().getFullName() != null ? 
                booking.getUser().getFullName() : booking.getUser().getUsername());
        }
        
        return ResponseEntity.ok(result);
    }

    // Admin không được tạo booking mới - booking chỉ được tạo từ frontend user
    // @PostMapping - REMOVED
    
    // Admin không được sửa thông tin booking - chỉ được thay đổi status
    // @PutMapping("/{id}") - REMOVED
    
    // Admin không được xóa booking - chỉ được hủy booking
    // @DeleteMapping("/{id}") - REMOVED

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusData) {
        try {
            BookingStatus status = BookingStatus.valueOf(statusData.get("status"));
            Booking updatedBooking = bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, @RequestBody Map<String, String> cancelData) {
        try {
            String reason = cancelData.get("reason");
            Booking cancelledBooking = bookingService.cancelBookingByAdmin(id, reason);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/refund")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> refundBooking(@PathVariable Long id, @RequestBody Map<String, Object> refundData) {
        try {
            BigDecimal amount = new BigDecimal(refundData.get("amount").toString());
            String reason = (String) refundData.get("reason");
            Booking refundedBooking = bookingService.refundBooking(id, amount, reason);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
