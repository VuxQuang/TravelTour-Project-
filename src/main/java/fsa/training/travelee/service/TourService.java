package fsa.training.travelee.service;

import fsa.training.travelee.dto.TourCreateRequest;
import fsa.training.travelee.dto.TourListDto;
import fsa.training.travelee.dto.TourSelectionDto;
import fsa.training.travelee.entity.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TourService {
    void createTour(TourCreateRequest request);

    List<TourListDto> getAllTours();
    List<TourSelectionDto> getToursForSelection();
    void deleteTourById(Long id);
    void updateTour(Long id, TourCreateRequest request);
    Tour getById(Long id);
    long countTours();
    
    // Admin methods
    Page<Tour> getAllToursForAdmin(String keyword, String status, Pageable pageable);
    Tour createTourAdmin(Tour tour);
    Tour updateTourAdmin(Tour tour);
    void deleteTourAdmin(Long id);
}
