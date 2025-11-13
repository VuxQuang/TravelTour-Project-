package fsa.training.travelee.service;

import fsa.training.travelee.entity.TourSchedule;
import fsa.training.travelee.repository.TourScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ScheduleServiceImpl implements ScheduleService {

    private final TourScheduleRepository tourScheduleRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<TourSchedule> getAllSchedules(
            String keyword, 
            String status, 
            Long tourId, 
            String startDate, 
            String endDate, 
            Pageable pageable
    ) {
        // Implementation sẽ phụ thuộc vào repository methods
        // Tạm thời return tất cả
        return tourScheduleRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public TourSchedule getScheduleById(Long id) {
        return tourScheduleRepository.findById(id).orElse(null);
    }

    @Override
    public TourSchedule createSchedule(TourSchedule schedule) {
        return tourScheduleRepository.save(schedule);
    }

    @Override
    public TourSchedule updateSchedule(TourSchedule schedule) {
        return tourScheduleRepository.save(schedule);
    }

    @Override
    public void deleteSchedule(Long id) {
        tourScheduleRepository.deleteById(id);
    }

    @Override
    public TourSchedule updateScheduleStatus(Long id, String status) {
        TourSchedule schedule = getScheduleById(id);
        if (schedule != null) {
            schedule.setStatus(status);
            return tourScheduleRepository.save(schedule);
        }
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TourSchedule> getSchedulesByTour(Long tourId) {
        // Tạm thời return tất cả schedules, sau này có thể implement findByTourId trong repository
        return tourScheduleRepository.findAll().stream()
                .filter(schedule -> schedule.getTour() != null && schedule.getTour().getId().equals(tourId))
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TourSchedule> getSchedulesByTour(Long tourId, Pageable pageable) {
        // Tạm thời return tất cả schedules với phân trang, sau này có thể implement findByTourId trong repository
        List<TourSchedule> allSchedules = getSchedulesByTour(tourId);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), allSchedules.size());
        List<TourSchedule> pageContent = allSchedules.subList(start, end);
        return new org.springframework.data.domain.PageImpl<>(pageContent, pageable, allSchedules.size());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TourSchedule> getSchedulesByDate(LocalDate date) {
        // Tạm thời return tất cả schedules, sau này có thể implement findByDepartureDate trong repository
        return tourScheduleRepository.findAll().stream()
                .filter(schedule -> schedule.getDepartureDate() != null && schedule.getDepartureDate().equals(date))
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TourSchedule> getSchedulesByDateRange(LocalDate startDate, LocalDate endDate) {
        // Tạm thời return tất cả schedules, sau này có thể implement findByDepartureDateBetween trong repository
        return tourScheduleRepository.findAll().stream()
                .filter(schedule -> schedule.getDepartureDate() != null && 
                        !schedule.getDepartureDate().isBefore(startDate) && 
                        !schedule.getDepartureDate().isAfter(endDate))
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return tourScheduleRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isScheduleInUse(Long id) {
        // Implementation để kiểm tra schedule có đang được sử dụng trong bookings không
        // Tạm thời return false
        return false;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TourSchedule> findByTourId(Long tourId) {
        return getSchedulesByTour(tourId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TourSchedule> findByTourId(Long tourId, Pageable pageable) {
        return getSchedulesByTour(tourId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TourSchedule> findByDepartureDate(LocalDate date) {
        return getSchedulesByDate(date);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TourSchedule> findByDepartureDateBetween(LocalDate startDate, LocalDate endDate) {
        return getSchedulesByDateRange(startDate, endDate);
    }
}
