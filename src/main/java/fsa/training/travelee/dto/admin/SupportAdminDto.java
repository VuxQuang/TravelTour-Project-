package fsa.training.travelee.dto.admin;

import fsa.training.travelee.entity.SupportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportAdminDto {
    private Long id;
    private String title;
    private String subject;
    private String content;
    private String description;
    private String reply;
    private String response;
    private SupportStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime repliedAt;
    private String replyBy;
    
    // User info (if logged in user)
    private Long userId;
    private String userName;
    
    // Guest info (if not logged in)
    private String senderName;
    private String senderEmail;
    private String senderPhone;
    
    // Additional fields for admin
    private String category;
    private String priority;
}
