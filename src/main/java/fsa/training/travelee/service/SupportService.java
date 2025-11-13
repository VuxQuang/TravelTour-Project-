package fsa.training.travelee.service;

import fsa.training.travelee.entity.SupportRequest;
import fsa.training.travelee.entity.SupportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SupportService {
    
    // Lấy tất cả support requests với phân trang và filter
    Page<SupportRequest> getAllSupportRequests(
            String keyword, 
            SupportStatus status, 
            String category, 
            String priority, 
            Pageable pageable
    );
    
    // Lấy support request theo ID
    SupportRequest getSupportRequestById(Long id);
    
    // Tạo support request mới
    SupportRequest createSupportRequest(SupportRequest supportRequest);
    
    // Cập nhật support request
    SupportRequest updateSupportRequest(SupportRequest supportRequest);
    
    // Xóa support request
    void deleteSupportRequest(Long id);
    
    // Cập nhật status
    SupportRequest updateSupportRequestStatus(Long id, SupportStatus status);
    
    // Trả lời support request
    SupportRequest replyToSupportRequest(Long id, String reply);
    
    // Lấy support requests theo user
    Page<SupportRequest> getSupportRequestsByUser(Long userId, Pageable pageable);
    
    // Lấy support requests theo status
    Page<SupportRequest> getSupportRequestsByStatus(SupportStatus status, Pageable pageable);
    
    // Lấy support requests theo user với phân trang (alias method)
    Page<SupportRequest> findByUserId(Long userId, Pageable pageable);
    
    // Lấy support requests theo status với phân trang (alias method)
    Page<SupportRequest> findByStatus(SupportStatus status, Pageable pageable);
}
