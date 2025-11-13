package fsa.training.travelee.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDto {
    private Long id;
    private String title;
    private String content;
    private String summary;
    private String status;
    private Long categoryId;
    private String tags;
    private String featuredImage;
    private Long authorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Additional fields for display
    private String categoryName;
    private String authorName;
    private String statusDisplay;
    private List<String> tagList;
}
