package fsa.training.travelee.controller.api;

import fsa.training.travelee.dto.ArticleDto;
import fsa.training.travelee.entity.Article;
import fsa.training.travelee.entity.Category;
import fsa.training.travelee.entity.CategoryType;
import fsa.training.travelee.service.ArticleService;
import fsa.training.travelee.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/articles")
@RequiredArgsConstructor
public class AdminArticleApiController {

    private final ArticleService articleService;
    private final CategoryService categoryService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "status", required = false) String status,
            Pageable pageable
    ) {
        Page<Article> articlePage = articleService.findAll(keyword, categoryId, CategoryType.ARTICLE, pageable);
        
        System.out.println("Total articles found: " + articlePage.getTotalElements());
        System.out.println("Articles in current page: " + articlePage.getContent().size());
        
        List<Map<String, Object>> items = articlePage.getContent().stream().map(article -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", article.getId());
            item.put("title", article.getTitle());
            item.put("content", article.getContent());
            item.put("summary", article.getDescription()); // Map description to summary
            item.put("status", article.getStatus() != null ? article.getStatus().toString() : "ACTIVE");
            item.put("featuredImage", article.getThumbnail()); // Map thumbnail to featuredImage
            item.put("createdAt", article.getCreatedAt());
            item.put("updatedAt", article.getUpdatedAt());
            
            // Handle categories
            if (article.getCategories() != null && !article.getCategories().isEmpty()) {
                Category firstCategory = article.getCategories().iterator().next();
                item.put("categoryId", firstCategory.getId());
                item.put("categoryName", firstCategory.getName());
            }
            
            // Handle author
            if (article.getUser() != null) {
                item.put("authorId", article.getUser().getId());
                item.put("authorName", article.getUser().getFullName());
            }
            
            return item;
        }).toList();

        Map<String, Object> result = new HashMap<>();
        result.put("items", items);
        result.put("totalPages", articlePage.getTotalPages());
        result.put("totalElements", articlePage.getTotalElements());
        result.put("page", articlePage.getNumber());
        result.put("size", articlePage.getSize());
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        try {
            Article article = articleService.findByIdOrThrow(id);
            Map<String, Object> result = new HashMap<>();
            result.put("id", article.getId());
            result.put("title", article.getTitle());
            result.put("content", article.getContent());    
            result.put("summary", article.getDescription());
            result.put("status", article.getStatus() != null ? article.getStatus().toString() : "ACTIVE");
            result.put("featuredImage", article.getThumbnail());
            result.put("createdAt", article.getCreatedAt());
            result.put("updatedAt", article.getUpdatedAt());
            
            // Handle categories
            if (article.getCategories() != null && !article.getCategories().isEmpty()) {
                Category firstCategory = article.getCategories().iterator().next();
                result.put("categoryId", firstCategory.getId());
                result.put("categoryName", firstCategory.getName());
            }
            
            // Handle author
            if (article.getUser() != null) {
                result.put("authorId", article.getUser().getId());
                result.put("authorName", article.getUser().getFullName());
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Không tìm thấy bài viết với ID: " + id);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> create(@RequestBody ArticleDto articleDto) {
        try {
            // Debug logging
            System.out.println("Received ArticleDto: " + articleDto);
            System.out.println("Title: " + articleDto.getTitle());
            System.out.println("Content: " + articleDto.getContent());
            System.out.println("Summary: " + articleDto.getSummary());
            
            // Basic validation - chỉ validate 3 field cơ bản
            if (articleDto.getTitle() == null || articleDto.getTitle().trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Tiêu đề bài viết không được để trống");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (articleDto.getContent() == null || articleDto.getContent().trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Nội dung bài viết không được để trống");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Set default values
            if (articleDto.getSummary() == null) {
                articleDto.setSummary("");
            }
            
            Article article = articleService.createArticle(articleDto);
            Map<String, Object> result = new HashMap<>();
            result.put("id", article.getId());
            result.put("title", article.getTitle());
            result.put("message", "Tạo bài viết thành công");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error creating article: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Tạo bài viết thất bại: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody ArticleDto articleDto) {
        try {
            Article article = articleService.updateArticle(id, articleDto);
            Map<String, Object> result = new HashMap<>();
            result.put("id", article.getId());
            result.put("title", article.getTitle());
            result.put("message", "Cập nhật bài viết thành công");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Cập nhật bài viết thất bại: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        try {
            articleService.deleteArticle(id);
            Map<String, Object> result = new HashMap<>();
            result.put("message", "Xóa bài viết thành công");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Xóa bài viết thất bại: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/categories")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<List<Map<String, Object>>> getCategories() {
        try {
            List<Category> categories = categoryService.findByType(CategoryType.ARTICLE);
            List<Map<String, Object>> result = categories.stream().map(category -> {
                Map<String, Object> item = new HashMap<>();
                item.put("value", category.getId());
                item.put("label", category.getName());
                item.put("description", category.getDescription());
                return item;
            }).toList();

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
