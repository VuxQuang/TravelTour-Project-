package fsa.training.travelee.controller.admin;

import fsa.training.travelee.dto.TourCreateRequest;
import fsa.training.travelee.dto.TourListDto;
import fsa.training.travelee.entity.Category;
import fsa.training.travelee.entity.CategoryType;
import fsa.training.travelee.service.TourService;
import fsa.training.travelee.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import fsa.training.travelee.entity.Tour;
import fsa.training.travelee.mapper.TourMapper;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/admin/tour")
public class TourAdminController {

    private final TourService tourService;
    private final CategoryRepository categoryRepository;
    private final TourMapper tourMapper;

    @GetMapping("/list")
    public String showTourList(Model model) {
        List<TourListDto> tours = tourService.getAllTours();
        model.addAttribute("tours", tours);
        return "admin/tour/tour-page";
    }

    @GetMapping("/view/{id}")
    public String viewTour(@PathVariable Long id, Model model) {
        try {
            Tour tour = tourService.getById(id);
            TourCreateRequest tourRequest = tourMapper.toDto(tour);
            List<Category> categories = categoryRepository.findByType(CategoryType.TOUR);

            model.addAttribute("tour", tour);
            model.addAttribute("tourCreateRequest", tourRequest);
            model.addAttribute("categories", categories);
            model.addAttribute("isReadOnly", true);

            return "admin/tour/create-tour";
        } catch (RuntimeException e) {
            System.err.println(">>> Error loading tour: " + e.getMessage());
            e.printStackTrace();
            return "redirect:/admin/tour/list";
        }
    }

    @GetMapping("/{id}")
    public String showTourDetail(@PathVariable Long id, Model model) {
        // Redirect to view method for readonly display
        return "redirect:/admin/tour/view/" + id;
    }

    @GetMapping("/create")
    public String showCreateTourForm(Model model) {
        System.out.println("=== CREATE TOUR FORM DEBUG ===");
        List<Category> categories = categoryRepository.findByType(CategoryType.TOUR);
        model.addAttribute("categories", categories);
        model.addAttribute("tourCreateRequest", new TourCreateRequest());
        model.addAttribute("isReadOnly", false);
        System.out.println("isReadOnly: false");
        System.out.println("==============================");
        return "admin/tour/create-tour";
    }

    @PostMapping("/create")
    public String createTour(@ModelAttribute TourCreateRequest request) {
        tourService.createTour(request);
//        System.out.println(">>> DESCRIPTION: " + request.getDescription());
        return "redirect:/admin/tour/list";
    }

    @GetMapping("/edit/{id}")
    public String showEditTourForm(@PathVariable Long id, Model model) {
        try {
            Tour tour = tourService.getById(id);
            TourCreateRequest tourRequest = tourMapper.toDto(tour);
            List<Category> categories = categoryRepository.findByType(CategoryType.TOUR);

            model.addAttribute("tour", tour);
            model.addAttribute("tourCreateRequest", tourRequest);
            model.addAttribute("categories", categories);
            model.addAttribute("isReadOnly", false);
            model.addAttribute("isUpdate", true);

            return "admin/tour/edit-tour";
        } catch (RuntimeException e) {
            return "redirect:/admin/tour/list";
        }
    }

    @PostMapping("/edit/{id}")
    public String updateTour(@PathVariable Long id, @ModelAttribute TourCreateRequest request) {
        try {
            tourService.updateTour(id, request);
            return "redirect:/admin/tour/list";
        } catch (RuntimeException e) {
            return "redirect:/admin/tour/edit/" + id;
        }
    }

    @GetMapping("/delete/{id}")
    public String deleteTour(@PathVariable Long id) {
        try {
            tourService.deleteTourById(id);
        } catch (RuntimeException e) {
            // Xử lý lỗi nếu cần
        }
        return "redirect:/admin/tour/list";
    }

    // ========== API ENDPOINTS FOR REACT FRONTEND ==========
    
    @GetMapping("/api")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> listToursApi(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "status", required = false) String status,
            Pageable pageable
    ) {
        try {
            // Sử dụng service để lấy Page<Tour> với đầy đủ thông tin
            Page<Tour> toursPage = tourService.getAllToursForAdmin(keyword, status, pageable);
            
            // Convert to Map format for React frontend
            List<Map<String, Object>> items = toursPage.getContent().stream().map(tour -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", tour.getId());
                m.put("title", tour.getTitle());
                m.put("description", tour.getDescription());
                m.put("price", tour.getAdultPrice());
                m.put("duration", tour.getDuration());
                m.put("maxParticipants", tour.getMaxParticipants());
                m.put("status", tour.getStatus());
                m.put("departure", tour.getDeparture());
                m.put("destination", tour.getDestination());
                m.put("createdAt", tour.getCreatedAt());
                m.put("updatedAt", tour.getUpdatedAt());
                return m;
            }).toList();

            Map<String, Object> result = new HashMap<>();
            result.put("items", items);
            result.put("totalPages", toursPage.getTotalPages());
            result.put("totalElements", toursPage.getTotalElements());
            result.put("page", toursPage.getNumber());
            result.put("size", toursPage.getSize());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/api/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> getTourByIdApi(@PathVariable Long id) {
        try {
            Tour tour = tourService.getById(id);
            if (tour == null) {
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> result = new HashMap<>();
            result.put("id", tour.getId());
            result.put("title", tour.getTitle());
            result.put("description", tour.getDescription());
            result.put("highlights", tour.getHighlights());
            result.put("adultPrice", tour.getAdultPrice());
            result.put("childPrice", tour.getChildPrice());
            result.put("duration", tour.getDuration());
            result.put("departure", tour.getDeparture());
            result.put("destination", tour.getDestination());
            result.put("maxParticipants", tour.getMaxParticipants());
            result.put("availableSlots", tour.getAvailableSlots());
            result.put("status", tour.getStatus());
            result.put("featured", tour.getFeatured());
            result.put("isHot", tour.getIsHot());
            result.put("hasPromotion", tour.getHasPromotion());
            result.put("includes", tour.getIncludes());
            result.put("excludes", tour.getExcludes());
            result.put("terms", tour.getTerms());
            result.put("createdAt", tour.getCreatedAt());
            result.put("updatedAt", tour.getUpdatedAt());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/api")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> createTourApi(@RequestBody TourCreateRequest request) {
        try {
            tourService.createTour(request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/api/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> updateTourApi(@PathVariable Long id, @RequestBody TourCreateRequest request) {
        try {
            tourService.updateTour(id, request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/api/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> deleteTourApi(@PathVariable Long id) {
        try {
            tourService.deleteTourById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
