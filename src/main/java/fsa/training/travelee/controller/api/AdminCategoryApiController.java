package fsa.training.travelee.controller.api;

import fsa.training.travelee.entity.Category;
import fsa.training.travelee.entity.CategoryStatus;
import fsa.training.travelee.entity.CategoryType;
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
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryApiController {

    private final CategoryService categoryService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "status", required = false) CategoryStatus status,
            @RequestParam(value = "type", required = false) CategoryType type,
            Pageable pageable
    ) {
        Page<Category> categoriesPage = categoryService.getAllCategories(
                keyword, status, type, pageable
        );
        
        List<Map<String, Object>> items = categoriesPage.getContent().stream().map(category -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", category.getId());
            m.put("name", category.getName());
            m.put("description", category.getDescription());
            m.put("type", category.getType());
            m.put("status", category.getStatus());
            return m;
        }).toList();

        Map<String, Object> result = new HashMap<>();
        result.put("items", items);
        result.put("totalPages", categoriesPage.getTotalPages());
        result.put("totalElements", categoriesPage.getTotalElements());
        result.put("page", categoriesPage.getNumber());
        result.put("size", categoriesPage.getSize());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id);
        if (category == null) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("id", category.getId());
        result.put("name", category.getName());
        result.put("description", category.getDescription());
        result.put("type", category.getType());
        result.put("status", category.getStatus());
        
        return ResponseEntity.ok(result);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> categoryData) {
        try {
            String name = (String) categoryData.get("name");
            String description = (String) categoryData.get("description");
            CategoryType type = CategoryType.valueOf((String) categoryData.get("type"));
            CategoryStatus status = CategoryStatus.valueOf((String) categoryData.get("status"));
            
            Category category = Category.builder()
                    .name(name)
                    .description(description)
                    .type(type)
                    .status(status)
                    .build();
            
            Category savedCategory = categoryService.createCategory(category);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> categoryData) {
        try {
            Category category = categoryService.getCategoryById(id);
            if (category == null) {
                return ResponseEntity.notFound().build();
            }
            
            String name = (String) categoryData.get("name");
            String description = (String) categoryData.get("description");
            CategoryType type = CategoryType.valueOf((String) categoryData.get("type"));
            CategoryStatus status = CategoryStatus.valueOf((String) categoryData.get("status"));
            
            category.setName(name);
            category.setDescription(description);
            category.setType(type);
            category.setStatus(status);
            
            Category updatedCategory = categoryService.updateCategory(category);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            Category category = categoryService.getCategoryById(id);
            if (category == null) {
                return ResponseEntity.notFound().build();
            }
            
            categoryService.deleteCategory(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusData) {
        try {
            CategoryStatus status = CategoryStatus.valueOf(statusData.get("status"));
            Category updatedCategory = categoryService.updateCategoryStatus(id, status);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
