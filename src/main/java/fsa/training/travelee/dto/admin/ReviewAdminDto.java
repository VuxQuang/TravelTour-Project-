package fsa.training.travelee.dto.admin;

import fsa.training.travelee.entity.review.ReviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewAdminDto {
    private Long id;
    private Integer rating;
    private String comment;
    private String title;
    private String adminResponse;
    private String response;
    private ReviewStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Tour info
    private Long tourId;
    private String tourTitle;
    
    // User info
    private Long userId;
    private String userName;
    
    // Booking info
    private Long bookingId;
    private String bookingCode;
}
