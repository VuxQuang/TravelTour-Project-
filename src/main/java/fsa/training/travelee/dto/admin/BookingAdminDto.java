package fsa.training.travelee.dto.admin;

import fsa.training.travelee.entity.booking.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingAdminDto {
    private Long id;
    private String bookingCode;
    private Integer adultCount;
    private Integer childCount;
    private Integer participants;
    private BigDecimal totalAmount;
    private BigDecimal totalPrice;
    private String specialRequests;
    private String notes;
    private BookingStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Tour info
    private Long tourId;
    private String tourTitle;
    
    // User info
    private Long userId;
    private String userName;
    
    // Schedule info
    private Long scheduleId;
    private String scheduleInfo;
}
