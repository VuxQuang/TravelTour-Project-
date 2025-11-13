package fsa.training.travelee.service;

import fsa.training.travelee.entity.SupportRequest;
import fsa.training.travelee.entity.SupportStatus;
import fsa.training.travelee.repository.SupportRequestRepository;
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
public class SupportServiceImpl implements SupportService {

    private final SupportRequestRepository supportRequestRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<SupportRequest> getAllSupportRequests(
            String keyword, 
            SupportStatus status, 
            String category, 
            String priority, 
            Pageable pageable
    ) {
        // Implementation sẽ phụ thuộc vào repository methods
        // Tạm thời return tất cả
        return supportRequestRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public SupportRequest getSupportRequestById(Long id) {
        return supportRequestRepository.findById(id).orElse(null);
    }

    @Override
    public SupportRequest createSupportRequest(SupportRequest supportRequest) {
        return supportRequestRepository.save(supportRequest);
    }

    @Override
    public SupportRequest updateSupportRequest(SupportRequest supportRequest) {
        return supportRequestRepository.save(supportRequest);
    }

    @Override
    public void deleteSupportRequest(Long id) {
        supportRequestRepository.deleteById(id);
    }

    @Override
    public SupportRequest updateSupportRequestStatus(Long id, SupportStatus status) {
        SupportRequest supportRequest = getSupportRequestById(id);
        if (supportRequest != null) {
            supportRequest.setStatus(status);
            return supportRequestRepository.save(supportRequest);
        }
        return null;
    }

    @Override
    public SupportRequest replyToSupportRequest(Long id, String reply) {
        SupportRequest supportRequest = getSupportRequestById(id);
        if (supportRequest != null) {
            supportRequest.setReply(reply);
            supportRequest.setStatus(SupportStatus.RESOLVED);
            return supportRequestRepository.save(supportRequest);
        }
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SupportRequest> getSupportRequestsByUser(Long userId, Pageable pageable) {
        // Tạm thời return tất cả support requests, sau này có thể implement findByUserId trong repository
        List<SupportRequest> allRequests = supportRequestRepository.findAll().stream()
                .filter(request -> request.getUser() != null && request.getUser().getId().equals(userId))
                .collect(java.util.stream.Collectors.toList());
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), allRequests.size());
        List<SupportRequest> pageContent = allRequests.subList(start, end);
        return new org.springframework.data.domain.PageImpl<>(pageContent, pageable, allRequests.size());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SupportRequest> getSupportRequestsByStatus(SupportStatus status, Pageable pageable) {
        // Tạm thời return tất cả support requests, sau này có thể implement findByStatus trong repository
        List<SupportRequest> allRequests = supportRequestRepository.findAll().stream()
                .filter(request -> request.getStatus() == status)
                .collect(java.util.stream.Collectors.toList());
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), allRequests.size());
        List<SupportRequest> pageContent = allRequests.subList(start, end);
        return new org.springframework.data.domain.PageImpl<>(pageContent, pageable, allRequests.size());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SupportRequest> findByUserId(Long userId, Pageable pageable) {
        return getSupportRequestsByUser(userId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SupportRequest> findByStatus(SupportStatus status, Pageable pageable) {
        return getSupportRequestsByStatus(status, pageable);
    }
}
