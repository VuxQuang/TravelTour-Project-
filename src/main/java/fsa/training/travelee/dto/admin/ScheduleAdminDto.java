package fsa.training.travelee.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleAdminDto {
    private Long id;
    private LocalDate departureDate;
    private LocalDate returnDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal specialPrice;
    private Integer availableSlots;
    private String status;
    private LocalDateTime createdAt;
    
    // Tour info
    private Long tourId;
    private String tourTitle;
    
    // Additional fields for admin
    private String title;
    private String location;
    private String description;
    private String startTime;
    private String endTime;
    private Integer bookedSlots;
    private Integer remainingSlots;
}
