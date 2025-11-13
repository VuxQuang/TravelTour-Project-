package fsa.training.travelee.dto.admin;

import fsa.training.travelee.entity.CategoryStatus;
import fsa.training.travelee.entity.CategoryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryAdminDto {
    private Long id;
    private String name;
    private String description;
    private CategoryType type;
    private CategoryStatus status;
    
    // Additional fields for admin
    private Long parentId;
    private String parentName;
    private Integer tourCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
