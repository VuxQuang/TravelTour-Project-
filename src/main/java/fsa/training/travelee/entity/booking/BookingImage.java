package fsa.training.travelee.entity.booking;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "booking_images")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingImage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;
    
    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;
    
    @Column(name = "image_name", length = 255)
    private String imageName;
    
    @Column(name = "image_size")
    private Long imageSize;
    
    @Column(name = "mime_type", length = 100)
    private String mimeType;
    
    @Column(name = "is_primary")
    private Boolean isPrimary = false;
    
    @Column(name = "description", length = 1000)
    private String description;
    
    @Column(name = "uploaded_by", length = 100)
    private String uploadedBy;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
