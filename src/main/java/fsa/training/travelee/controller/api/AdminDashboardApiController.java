package fsa.training.travelee.controller.api;

import fsa.training.travelee.service.ActivityService;
import fsa.training.travelee.service.BookingService;
import fsa.training.travelee.service.TourService;
import fsa.training.travelee.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardApiController {

    private final UserRepository userRepository;
    private final TourService tourService;
    private final BookingService bookingService;
    private final ActivityService activityService;

    @GetMapping("/monthly-stats")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> monthlyStats(@RequestParam int year, @RequestParam int month) {
        long monthlyBookings = bookingService.countBookingsByMonth(year, month);
        java.math.BigDecimal monthlyRevenue = bookingService.getRevenueByMonth(year, month);
        java.util.List<fsa.training.travelee.dto.MonthlyBookingStatsDto> monthlyStats = bookingService.getMonthlyBookingStats(year, month);

        Map<String, Object> response = new HashMap<>();
        response.put("monthlyBookings", monthlyBookings);
        response.put("monthlyRevenue", monthlyRevenue);
        response.put("monthlyStats", monthlyStats);
        response.put("year", year);
        response.put("month", month);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> summary() {
        long totalUsers = userRepository.count();
        long totalTours = tourService.countTours();
        long todayBookings = bookingService.countTodayBookings();
        Map<String, Object> res = new HashMap<>();
        res.put("totalUsers", totalUsers);
        res.put("totalTours", totalTours);
        res.put("todayBookings", todayBookings);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/recent-activities")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> recentActivities(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(activityService.getRecentActivities(limit));
    }
}


