package fsa.training.travelee.controller.api;

import fsa.training.travelee.entity.booking.BookingImage;
import fsa.training.travelee.service.BookingImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/bookings/{bookingId}/images")
@RequiredArgsConstructor
public class AdminBookingImageApiController {

    private final BookingImageService bookingImageService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> getBookingImages(
            @PathVariable Long bookingId,
            @RequestParam(value = "keyword", required = false) String keyword,
            Pageable pageable
    ) {
        List<BookingImage> images;
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            images = bookingImageService.searchBookingImages(bookingId, keyword);
        } else {
            images = bookingImageService.getBookingImages(bookingId);
        }
        
        List<Map<String, Object>> items = images.stream().map(image -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", image.getId());
            m.put("imageUrl", image.getImageUrl());
            m.put("imageName", image.getImageName());
            m.put("imageSize", image.getImageSize());
            m.put("mimeType", image.getMimeType());
            m.put("isPrimary", image.getIsPrimary());
            m.put("description", image.getDescription());
            m.put("uploadedBy", image.getUploadedBy());
            m.put("createdAt", image.getCreatedAt());
            m.put("updatedAt", image.getUpdatedAt());
            return m;
        }).toList();

        Map<String, Object> result = new HashMap<>();
        result.put("items", items);
        result.put("totalCount", images.size());
        result.put("imageCount", bookingImageService.getImageCount(bookingId));
        result.put("totalSize", bookingImageService.getTotalImageSize(bookingId));
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{imageId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> getBookingImage(
            @PathVariable Long bookingId,
            @PathVariable Long imageId
    ) {
        BookingImage image = bookingImageService.getBookingImageById(imageId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("id", image.getId());
        result.put("imageUrl", image.getImageUrl());
        result.put("imageName", image.getImageName());
        result.put("imageSize", image.getImageSize());
        result.put("mimeType", image.getMimeType());
        result.put("isPrimary", image.getIsPrimary());
        result.put("description", image.getDescription());
        result.put("uploadedBy", image.getUploadedBy());
        result.put("createdAt", image.getCreatedAt());
        result.put("updatedAt", image.getUpdatedAt());
        
        return ResponseEntity.ok(result);
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> uploadImage(
            @PathVariable Long bookingId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "uploadedBy", defaultValue = "admin") String uploadedBy
    ) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            // Kiểm tra loại file
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "File must be an image"));
            }

            // Kiểm tra kích thước file (max 10MB)
            if (file.getSize() > 10 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(Map.of("error", "File size must be less than 10MB"));
            }

            BookingImage uploadedImage = bookingImageService.uploadBookingImage(
                    bookingId, file, description, uploadedBy
            );

            Map<String, Object> result = new HashMap<>();
            result.put("id", uploadedImage.getId());
            result.put("imageUrl", uploadedImage.getImageUrl());
            result.put("imageName", uploadedImage.getImageName());
            result.put("imageSize", uploadedImage.getImageSize());
            result.put("mimeType", uploadedImage.getMimeType());
            result.put("isPrimary", uploadedImage.getIsPrimary());
            result.put("description", uploadedImage.getDescription());
            result.put("uploadedBy", uploadedImage.getUploadedBy());
            result.put("createdAt", uploadedImage.getCreatedAt());

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/upload-multiple")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> uploadMultipleImages(
            @PathVariable Long bookingId,
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "uploadedBy", defaultValue = "admin") String uploadedBy
    ) {
        try {
            if (files == null || files.length == 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "No files provided"));
            }

            List<BookingImage> uploadedImages = bookingImageService.uploadMultipleBookingImages(
                    bookingId, files, uploadedBy
            );

            List<Map<String, Object>> items = uploadedImages.stream().map(image -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", image.getId());
                m.put("imageUrl", image.getImageUrl());
                m.put("imageName", image.getImageName());
                m.put("imageSize", image.getImageSize());
                m.put("mimeType", image.getMimeType());
                m.put("isPrimary", image.getIsPrimary());
                m.put("description", image.getDescription());
                m.put("uploadedBy", image.getUploadedBy());
                m.put("createdAt", image.getCreatedAt());
                return m;
            }).toList();

            Map<String, Object> result = new HashMap<>();
            result.put("items", items);
            result.put("uploadedCount", uploadedImages.size());

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{imageId}/set-primary")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> setPrimaryImage(
            @PathVariable Long bookingId,
            @PathVariable Long imageId
    ) {
        try {
            BookingImage image = bookingImageService.setPrimaryImage(imageId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("id", image.getId());
            result.put("imageUrl", image.getImageUrl());
            result.put("isPrimary", image.getIsPrimary());
            
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{imageId}/description")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> updateImageDescription(
            @PathVariable Long bookingId,
            @PathVariable Long imageId,
            @RequestBody Map<String, String> request
    ) {
        try {
            String description = request.get("description");
            BookingImage image = bookingImageService.updateImageDescription(imageId, description);
            
            Map<String, Object> result = new HashMap<>();
            result.put("id", image.getId());
            result.put("description", image.getDescription());
            
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{imageId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> deleteImage(
            @PathVariable Long bookingId,
            @PathVariable Long imageId
    ) {
        try {
            bookingImageService.deleteBookingImage(imageId);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> deleteAllImages(@PathVariable Long bookingId) {
        try {
            bookingImageService.deleteAllBookingImages(bookingId);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/primary")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> getPrimaryImage(@PathVariable Long bookingId) {
        BookingImage primaryImage = bookingImageService.getPrimaryBookingImage(bookingId);
        
        if (primaryImage == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> result = new HashMap<>();
        result.put("id", primaryImage.getId());
        result.put("imageUrl", primaryImage.getImageUrl());
        result.put("imageName", primaryImage.getImageName());
        result.put("imageSize", primaryImage.getImageSize());
        result.put("mimeType", primaryImage.getMimeType());
        result.put("isPrimary", primaryImage.getIsPrimary());
        result.put("description", primaryImage.getDescription());
        result.put("uploadedBy", primaryImage.getUploadedBy());
        result.put("createdAt", primaryImage.getCreatedAt());

        return ResponseEntity.ok(result);
    }
}
