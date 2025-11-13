package fsa.training.travelee.service;

import fsa.training.travelee.entity.Category;
import fsa.training.travelee.entity.CategoryStatus;
import fsa.training.travelee.entity.CategoryType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CategoryService {
    
    // Lấy tất cả categories với phân trang và filter
    Page<Category> getAllCategories(
            String keyword, 
            CategoryStatus status, 
            CategoryType type, 
            Pageable pageable
    );
    
    // Lấy category theo ID
    Category getCategoryById(Long id);
    
    // Tạo category mới
    Category createCategory(Category category);
    
    // Cập nhật category
    Category updateCategory(Category category);
    
    // Xóa category
    void deleteCategory(Long id);
    
    // Cập nhật status
    Category updateCategoryStatus(Long id, CategoryStatus status);
    
    // Lấy tất cả categories active
    List<Category> getAllActiveCategories();
    
    // Lấy categories theo type
    List<Category> getCategoriesByType(CategoryType type);
    
    // Lấy categories theo type (alias method)
    List<Category> findByType(CategoryType type);
    
    // Kiểm tra category có tồn tại không
    boolean existsById(Long id);
    
    // Kiểm tra category có đang được sử dụng không
    boolean isCategoryInUse(Long id);
    
    // Lấy tất cả categories với phân trang (legacy method)
    Page<Category> findAll(String keyword, Pageable pageable);
    
    // Lấy category theo ID (legacy method)
    Category findById(Long id);
    
    // Lưu category (legacy method)
    Category save(Category category);
    
    // Xóa category theo ID (legacy method)
    void deleteById(Long id);
}