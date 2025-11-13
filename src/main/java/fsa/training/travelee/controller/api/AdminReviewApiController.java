package fsa.training.travelee.controller.api;

import fsa.training.travelee.entity.review.Review;
import fsa.training.travelee.entity.review.ReviewStatus;
import fsa.training.travelee.service.ReviewService;
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
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewApiController {

    private final ReviewService reviewService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "status", required = false) ReviewStatus status,
            @RequestParam(value = "rating", required = false) Integer rating,
            @RequestParam(value = "tourId", required = false) Long tourId,
            Pageable pageable
    ) {
        Page<Review> reviewsPage = reviewService.getAllReviews(
                keyword, status, rating, tourId, pageable
        );
        
        List<Map<String, Object>> items = reviewsPage.getContent().stream().map(review -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", review.getId());
            m.put("rating", review.getRating());
            m.put("comment", review.getComment());
            m.put("adminResponse", review.getAdminResponse());
            m.put("status", review.getStatus());
            m.put("createdAt", review.getCreatedAt());
            m.put("updatedAt", review.getUpdatedAt());
            
            // Tour info
            if (review.getTour() != null) {
                m.put("tourId", review.getTour().getId());
                m.put("tourTitle", review.getTour().getTitle());
            }
            
            // User info
            if (review.getUser() != null) {
                m.put("userId", review.getUser().getId());
                m.put("userName", review.getUser().getFullName() != null ? 
                    review.getUser().getFullName() : review.getUser().getUsername());
            }
            
            // Booking info
            if (review.getBooking() != null) {
                m.put("bookingId", review.getBooking().getId());
                m.put("bookingCode", review.getBooking().getBookingCode());
            }
            
            return m;
        }).toList();

        Map<String, Object> result = new HashMap<>();
        result.put("items", items);
        result.put("totalPages", reviewsPage.getTotalPages());
        result.put("totalElements", reviewsPage.getTotalElements());
        result.put("page", reviewsPage.getNumber());
        result.put("size", reviewsPage.getSize());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        Review review = reviewService.getReviewById(id);
        if (review == null) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("id", review.getId());
        result.put("rating", review.getRating());
        result.put("comment", review.getComment());
        result.put("adminResponse", review.getAdminResponse());
        result.put("status", review.getStatus());
        result.put("createdAt", review.getCreatedAt());
        result.put("updatedAt", review.getUpdatedAt());
        
        // Tour info
        if (review.getTour() != null) {
            result.put("tourId", review.getTour().getId());
            result.put("tourTitle", review.getTour().getTitle());
        }
        
        // User info
        if (review.getUser() != null) {
            result.put("userId", review.getUser().getId());
            result.put("userName", review.getUser().getFullName() != null ? 
                review.getUser().getFullName() : review.getUser().getUsername());
        }
        
        // Booking info
        if (review.getBooking() != null) {
            result.put("bookingId", review.getBooking().getId());
            result.put("bookingCode", review.getBooking().getBookingCode());
        }
        
        return ResponseEntity.ok(result);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> reviewData) {
        try {
            // Implementation for creating review
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> reviewData) {
        try {
            Review review = reviewService.getReviewById(id);
            if (review == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Update review logic
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            Review review = reviewService.getReviewById(id);
            if (review == null) {
                return ResponseEntity.notFound().build();
            }
            
            reviewService.deleteReviewByAdmin(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusData) {
        try {
            ReviewStatus status = ReviewStatus.valueOf(statusData.get("status"));
            Review updatedReview = reviewService.updateReviewStatus(id, status);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/response")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> addResponse(@PathVariable Long id, @RequestBody Map<String, String> responseData) {
        try {
            String response = responseData.get("response");
            Review updatedReview = reviewService.addAdminResponse(id, response);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
