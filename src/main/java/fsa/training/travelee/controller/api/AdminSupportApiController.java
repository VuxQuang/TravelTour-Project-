package fsa.training.travelee.controller.api;

import fsa.training.travelee.entity.SupportRequest;
import fsa.training.travelee.entity.SupportStatus;
import fsa.training.travelee.service.SupportService;
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
@RequestMapping("/api/admin/support")
@RequiredArgsConstructor
public class AdminSupportApiController {

    private final SupportService supportService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "status", required = false) SupportStatus status,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "priority", required = false) String priority,
            Pageable pageable
    ) {
        Page<SupportRequest> supportPage = supportService.getAllSupportRequests(
                keyword, status, category, priority, pageable
        );
        
        List<Map<String, Object>> items = supportPage.getContent().stream().map(support -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", support.getId());
            m.put("subject", support.getTitle());
            m.put("title", support.getTitle());
            m.put("description", support.getContent());
            m.put("content", support.getContent());
            m.put("reply", support.getReply());
            m.put("response", support.getReply());
            m.put("status", support.getStatus());
            m.put("createdAt", support.getCreatedAt());
            m.put("repliedAt", support.getRepliedAt());
            m.put("replyBy", support.getReplyBy());
            
            // User info
            if (support.getUser() != null) {
                m.put("userId", support.getUser().getId());
                m.put("userName", support.getUser().getFullName() != null ? 
                    support.getUser().getFullName() : support.getUser().getUsername());
            } else {
                m.put("senderName", support.getSenderName());
                m.put("senderEmail", support.getSenderEmail());
                m.put("senderPhone", support.getSenderPhone());
            }
            
            return m;
        }).toList();

        Map<String, Object> result = new HashMap<>();
        result.put("items", items);
        result.put("totalPages", supportPage.getTotalPages());
        result.put("totalElements", supportPage.getTotalElements());
        result.put("page", supportPage.getNumber());
        result.put("size", supportPage.getSize());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        SupportRequest support = supportService.getSupportRequestById(id);
        if (support == null) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("id", support.getId());
        result.put("subject", support.getTitle());
        result.put("title", support.getTitle());
        result.put("description", support.getContent());
        result.put("content", support.getContent());
        result.put("reply", support.getReply());
        result.put("response", support.getReply());
        result.put("status", support.getStatus());
        result.put("createdAt", support.getCreatedAt());
        result.put("repliedAt", support.getRepliedAt());
        result.put("replyBy", support.getReplyBy());
        
        // User info
        if (support.getUser() != null) {
            result.put("userId", support.getUser().getId());
            result.put("userName", support.getUser().getFullName() != null ? 
                support.getUser().getFullName() : support.getUser().getUsername());
        } else {
            result.put("senderName", support.getSenderName());
            result.put("senderEmail", support.getSenderEmail());
            result.put("senderPhone", support.getSenderPhone());
        }
        
        return ResponseEntity.ok(result);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> supportData) {
        try {
            // Implementation for creating support request
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> supportData) {
        try {
            SupportRequest support = supportService.getSupportRequestById(id);
            if (support == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Update support request logic
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            SupportRequest support = supportService.getSupportRequestById(id);
            if (support == null) {
                return ResponseEntity.notFound().build();
            }
            
            supportService.deleteSupportRequest(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/reply")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> reply(@PathVariable Long id, @RequestBody Map<String, String> replyData) {
        try {
            String reply = replyData.get("reply");
            SupportRequest updatedSupport = supportService.replyToSupportRequest(id, reply);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusData) {
        try {
            SupportStatus status = SupportStatus.valueOf(statusData.get("status"));
            SupportRequest updatedSupport = supportService.updateSupportRequestStatus(id, status);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
