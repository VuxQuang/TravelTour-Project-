package fsa.training.travelee.service;

import fsa.training.travelee.dto.ArticleDto;
import fsa.training.travelee.entity.Article;
import fsa.training.travelee.entity.ArticleStatus;
import fsa.training.travelee.entity.Category;
import fsa.training.travelee.entity.CategoryType;
import fsa.training.travelee.entity.User;
import fsa.training.travelee.repository.ArticleRepository;
import fsa.training.travelee.repository.CategoryRepository;
import fsa.training.travelee.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ArticleServiceImpl implements ArticleService{

    private final ArticleRepository articleRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Override
    public Page<Article> findAll(String keyword, Long id, CategoryType type, Pageable pageable) {
        // If no specific filters, use simple query
        if ((keyword == null || keyword.trim().isEmpty()) && 
            (id == null || id == 0)) {
            return articleRepository.findAllArticles(pageable);
        }
        
        // Otherwise use complex query
        return articleRepository.searchByCategoryAndType(keyword, id, type, pageable);
    }

    @Override
    public Optional<Article> findById(Long id) {
        return articleRepository.findById(id);
    }
    
    @Override
    public Article findByIdOrThrow(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với ID: " + id));
    }

    @Override
    public Article save(Article article) {
        if (article.getId() != null) {
            article.setUpdatedAt(LocalDateTime.now());
        } else {
            article.setCreatedAt(LocalDateTime.now());
        }

        return articleRepository.save(article);
    }
    
    @Override
    public Article createArticle(ArticleDto articleDto) {
        Article article = new Article();
        
        // Chỉ set 3 field cơ bản
        article.setTitle(articleDto.getTitle());
        article.setContent(articleDto.getContent());
        article.setDescription(articleDto.getSummary()); // Map summary to description
        
        // Set các giá trị mặc định
        article.setStatus(ArticleStatus.ACTIVE); // Mặc định là ACTIVE
        article.setThumbnail(""); // Để trống
        article.setCreatedAt(LocalDateTime.now());
        
        // Không set category và author cho đơn giản
        
        return articleRepository.save(article);
    }
    
    @Override
    public Article updateArticle(Long id, ArticleDto articleDto) {
        Article article = findByIdOrThrow(id);
        
        article.setTitle(articleDto.getTitle());
        article.setContent(articleDto.getContent());
        article.setDescription(articleDto.getSummary()); // Map summary to description
        article.setThumbnail(articleDto.getFeaturedImage()); // Map featuredImage to thumbnail
        
        // Set status
        if (articleDto.getStatus() != null) {
            try {
                article.setStatus(ArticleStatus.valueOf(articleDto.getStatus()));
            } catch (IllegalArgumentException e) {
                article.setStatus(ArticleStatus.ACTIVE); // Default status
            }
        }

        article.setUpdatedAt(LocalDateTime.now());

        // Update category if provided
        if (articleDto.getCategoryId() != null) {
            Optional<Category> category = categoryRepository.findById(articleDto.getCategoryId());
            if (category.isPresent()) {
                article.getCategories().clear(); // Clear existing categories
                article.getCategories().add(category.get());
            }
        }
        
        return articleRepository.save(article);
    }
    
    @Override
    public void deleteArticle(Long id) {
        Article article = findByIdOrThrow(id);
        articleRepository.delete(article);
    }

    @Override
    public void deleteById(Long id) {
        articleRepository.deleteById(id);
    }

    @Override
    public List<Article> findTop3LatestArticles() {
        return articleRepository.findTop3LatestArticles();
    }

}
