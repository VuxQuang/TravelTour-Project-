package fsa.training.travelee.service;

import fsa.training.travelee.entity.TourSchedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {
    
    // Lấy tất cả schedules với phân trang và filter
    Page<TourSchedule> getAllSchedules(
            String keyword, 
            String status, 
            Long tourId, 
            String startDate, 
            String endDate, 
            Pageable pageable
    );
    
    // Lấy schedule theo ID
    TourSchedule getScheduleById(Long id);
    
    // Tạo schedule mới
    TourSchedule createSchedule(TourSchedule schedule);
    
    // Cập nhật schedule
    TourSchedule updateSchedule(TourSchedule schedule);
    
    // Xóa schedule
    void deleteSchedule(Long id);
    
    // Cập nhật status
    TourSchedule updateScheduleStatus(Long id, String status);
    
    // Lấy schedules theo tour
    List<TourSchedule> getSchedulesByTour(Long tourId);
    
    // Lấy schedules theo tour với phân trang
    Page<TourSchedule> getSchedulesByTour(Long tourId, Pageable pageable);
    
    // Lấy schedules theo ngày
    List<TourSchedule> getSchedulesByDate(LocalDate date);
    
    // Lấy schedules trong khoảng thời gian
    List<TourSchedule> getSchedulesByDateRange(LocalDate startDate, LocalDate endDate);
    
    // Kiểm tra schedule có tồn tại không
    boolean existsById(Long id);
    
    // Kiểm tra schedule có đang được sử dụng không
    boolean isScheduleInUse(Long id);
    
    // Lấy schedules theo tour (alias method)
    List<TourSchedule> findByTourId(Long tourId);
    
    // Lấy schedules theo tour với phân trang (alias method)
    Page<TourSchedule> findByTourId(Long tourId, Pageable pageable);
    
    // Lấy schedules theo ngày (alias method)
    List<TourSchedule> findByDepartureDate(LocalDate date);
    
    // Lấy schedules trong khoảng thời gian (alias method)
    List<TourSchedule> findByDepartureDateBetween(LocalDate startDate, LocalDate endDate);
}
