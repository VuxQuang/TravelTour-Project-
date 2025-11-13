package fsa.training.travelee.controller.api;

import fsa.training.travelee.entity.TourSchedule;
import fsa.training.travelee.service.ScheduleService;
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
@RequestMapping("/api/admin/schedule")
@RequiredArgsConstructor
public class AdminScheduleApiController {

    private final ScheduleService scheduleService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "tourId", required = false) Long tourId,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            Pageable pageable
    ) {
        Page<TourSchedule> schedulesPage = scheduleService.getAllSchedules(
                keyword, status, tourId, startDate, endDate, pageable
        );
        
        List<Map<String, Object>> items = schedulesPage.getContent().stream().map(schedule -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", schedule.getId());
            m.put("departureDate", schedule.getDepartureDate());
            m.put("returnDate", schedule.getReturnDate());
            m.put("startDate", schedule.getDepartureDate());
            m.put("endDate", schedule.getReturnDate());
            m.put("specialPrice", schedule.getSpecialPrice());
            m.put("availableSlots", schedule.getAvailableSlots());
            m.put("status", schedule.getStatus());
            m.put("createdAt", schedule.getCreatedAt());
            
            // Tour info
            if (schedule.getTour() != null) {
                m.put("tourId", schedule.getTour().getId());
                m.put("tourTitle", schedule.getTour().getTitle());
            }
            
            return m;
        }).toList();

        Map<String, Object> result = new HashMap<>();
        result.put("items", items);
        result.put("totalPages", schedulesPage.getTotalPages());
        result.put("totalElements", schedulesPage.getTotalElements());
        result.put("page", schedulesPage.getNumber());
        result.put("size", schedulesPage.getSize());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        TourSchedule schedule = scheduleService.getScheduleById(id);
        if (schedule == null) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("id", schedule.getId());
        result.put("departureDate", schedule.getDepartureDate());
        result.put("returnDate", schedule.getReturnDate());
        result.put("startDate", schedule.getDepartureDate());
        result.put("endDate", schedule.getReturnDate());
        result.put("specialPrice", schedule.getSpecialPrice());
        result.put("availableSlots", schedule.getAvailableSlots());
        result.put("status", schedule.getStatus());
        result.put("createdAt", schedule.getCreatedAt());
        
        // Tour info
        if (schedule.getTour() != null) {
            result.put("tourId", schedule.getTour().getId());
            result.put("tourTitle", schedule.getTour().getTitle());
        }
        
        return ResponseEntity.ok(result);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> scheduleData) {
        try {
            // Implementation for creating schedule
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> scheduleData) {
        try {
            TourSchedule schedule = scheduleService.getScheduleById(id);
            if (schedule == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Update schedule logic
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            TourSchedule schedule = scheduleService.getScheduleById(id);
            if (schedule == null) {
                return ResponseEntity.notFound().build();
            }
            
            scheduleService.deleteSchedule(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusData) {
        try {
            String status = statusData.get("status");
            TourSchedule updatedSchedule = scheduleService.updateScheduleStatus(id, status);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
