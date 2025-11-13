package fsa.training.travelee.service;

import fsa.training.travelee.entity.Category;
import fsa.training.travelee.entity.CategoryStatus;
import fsa.training.travelee.entity.CategoryType;
import fsa.training.travelee.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<Category> getAllCategories(
            String keyword, 
            CategoryStatus status, 
            CategoryType type, 
            Pageable pageable
    ) {
        // Implementation sẽ phụ thuộc vào repository methods
        // Tạm thời return tất cả
        return categoryRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    @Override
    public Category updateCategoryStatus(Long id, CategoryStatus status) {
        Category category = getCategoryById(id);
        if (category != null) {
            category.setStatus(status);
            return categoryRepository.save(category);
        }
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> getAllActiveCategories() {
        // Tạm thời return tất cả categories, sau này có thể implement findByStatus trong repository
        return categoryRepository.findAll().stream()
                .filter(category -> category.getStatus() == CategoryStatus.ACTIVE)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> getCategoriesByType(CategoryType type) {
        // Tạm thời return tất cả categories, sau này có thể implement findByType trong repository
        return categoryRepository.findAll().stream()
                .filter(category -> category.getType() == type)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return categoryRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isCategoryInUse(Long id) {
        // Implementation để kiểm tra category có đang được sử dụng trong tours không
        // Tạm thời return false
        return false;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> findByType(CategoryType type) {
        return getCategoriesByType(type);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Category> findAll(String keyword, Pageable pageable) {
        return getAllCategories(keyword, null, null, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Category findById(Long id) {
        return getCategoryById(id);
    }

    @Override
    public Category save(Category category) {
        if (category.getId() == null) {
            return createCategory(category);
        } else {
            return updateCategory(category);
        }
    }

    @Override
    public void deleteById(Long id) {
        deleteCategory(id);
    }
}