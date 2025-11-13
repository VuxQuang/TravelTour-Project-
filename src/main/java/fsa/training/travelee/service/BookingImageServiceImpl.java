package fsa.training.travelee.service;

import fsa.training.travelee.entity.booking.Booking;
import fsa.training.travelee.entity.booking.BookingImage;
import fsa.training.travelee.repository.BookingImageRepository;
import fsa.training.travelee.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BookingImageServiceImpl implements BookingImageService {

    private final BookingImageRepository bookingImageRepository;
    private final BookingRepository bookingRepository;

    @Value("${app.upload.path:uploads/booking-images}")
    private String uploadPath;

    @Override
    public BookingImage uploadBookingImage(Long bookingId, MultipartFile file, String description, String uploadedBy) {
        try {
            // Kiểm tra booking tồn tại
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

            // Tạo thư mục upload nếu chưa tồn tại
            Path uploadDir = Paths.get(uploadPath);
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // Tạo tên file unique
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null ? 
                    originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // Lưu file
            Path filePath = uploadDir.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Tạo URL
            String imageUrl = "/uploads/booking-images/" + uniqueFilename;

            // Tạo BookingImage entity
            BookingImage bookingImage = BookingImage.builder()
                    .booking(booking)
                    .imageUrl(imageUrl)
                    .imageName(originalFilename)
                    .imageSize(file.getSize())
                    .mimeType(file.getContentType())
                    .description(description)
                    .uploadedBy(uploadedBy)
                    .isPrimary(false)
                    .build();

            // Nếu đây là hình ảnh đầu tiên, đặt làm hình chính
            long imageCount = bookingImageRepository.countByBookingId(bookingId);
            if (imageCount == 0) {
                bookingImage.setIsPrimary(true);
            }

            return bookingImageRepository.save(bookingImage);

        } catch (IOException e) {
            log.error("Error uploading image for booking {}: {}", bookingId, e.getMessage());
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingImage> getBookingImages(Long bookingId) {
        return bookingImageRepository.findByBookingIdOrderByCreatedAtDesc(bookingId);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingImage getBookingImageById(Long imageId) {
        return bookingImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found with id: " + imageId));
    }

    @Override
    public void deleteBookingImage(Long imageId) {
        BookingImage image = getBookingImageById(imageId);
        
        // Xóa file vật lý
        try {
            String filename = image.getImageUrl().substring(image.getImageUrl().lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadPath, filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.warn("Failed to delete physical file for image {}: {}", imageId, e.getMessage());
        }

        // Nếu đây là hình chính, đặt hình khác làm hình chính
        if (image.getIsPrimary()) {
            List<BookingImage> otherImages = bookingImageRepository.findByBookingIdOrderByCreatedAtDesc(image.getBooking().getId())
                    .stream()
                    .filter(img -> !img.getId().equals(imageId))
                    .toList();
            
            if (!otherImages.isEmpty()) {
                BookingImage newPrimary = otherImages.get(0);
                newPrimary.setIsPrimary(true);
                bookingImageRepository.save(newPrimary);
            }
        }

        bookingImageRepository.deleteById(imageId);
    }

    @Override
    public void deleteAllBookingImages(Long bookingId) {
        List<BookingImage> images = getBookingImages(bookingId);
        
        // Xóa tất cả file vật lý
        for (BookingImage image : images) {
            try {
                String filename = image.getImageUrl().substring(image.getImageUrl().lastIndexOf("/") + 1);
                Path filePath = Paths.get(uploadPath, filename);
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                log.warn("Failed to delete physical file for image {}: {}", image.getId(), e.getMessage());
            }
        }

        bookingImageRepository.deleteByBookingId(bookingId);
    }

    @Override
    public BookingImage setPrimaryImage(Long imageId) {
        BookingImage image = getBookingImageById(imageId);
        
        // Bỏ đặt hình chính của tất cả hình ảnh khác
        List<BookingImage> allImages = getBookingImages(image.getBooking().getId());
        for (BookingImage img : allImages) {
            img.setIsPrimary(false);
            bookingImageRepository.save(img);
        }

        // Đặt hình này làm hình chính
        image.setIsPrimary(true);
        return bookingImageRepository.save(image);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingImage getPrimaryBookingImage(Long bookingId) {
        return bookingImageRepository.findByBookingIdAndIsPrimaryTrue(bookingId)
                .orElse(null);
    }

    @Override
    public BookingImage updateImageDescription(Long imageId, String description) {
        BookingImage image = getBookingImageById(imageId);
        image.setDescription(description);
        return bookingImageRepository.save(image);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingImage> getBookingImagesWithPagination(Long bookingId, Pageable pageable) {
        // Implementation sẽ phụ thuộc vào repository methods
        // Tạm thời return tất cả images
        return bookingImageRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingImage> searchBookingImages(Long bookingId, String keyword) {
        return bookingImageRepository.findByBookingIdAndImageNameContaining(bookingId, keyword);
    }

    @Override
    public List<BookingImage> uploadMultipleBookingImages(Long bookingId, MultipartFile[] files, String uploadedBy) {
        List<BookingImage> uploadedImages = new ArrayList<>();
        
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                BookingImage image = uploadBookingImage(bookingId, file, null, uploadedBy);
                uploadedImages.add(image);
            }
        }
        
        return uploadedImages;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canUploadImage(Long bookingId, String username) {
        // Kiểm tra quyền upload (có thể mở rộng logic này)
        return true; // Tạm thời cho phép tất cả
    }

    @Override
    @Transactional(readOnly = true)
    public long getImageCount(Long bookingId) {
        return bookingImageRepository.countByBookingId(bookingId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getTotalImageSize(Long bookingId) {
        return getBookingImages(bookingId).stream()
                .mapToLong(BookingImage::getImageSize)
                .sum();
    }
}
