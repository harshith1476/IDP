package com.drims.service;

import com.drims.dto.TargetDTO;
import com.drims.entity.Target;
import com.drims.repository.TargetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TargetService {
    
    @Autowired
    private TargetRepository targetRepository;
    
    public TargetDTO createOrUpdateTarget(String facultyId, TargetDTO dto) {
        try {
            if (facultyId == null || facultyId.isEmpty()) {
                throw new RuntimeException("Faculty ID is required");
            }
            
            if (dto.getYear() == null) {
                throw new RuntimeException("Year is required");
            }
            
            System.out.println("Creating/updating target for facultyId: " + facultyId + ", year: " + dto.getYear());
            
        Target target = targetRepository.findByFacultyIdAndYear(facultyId, dto.getYear())
                .orElse(new Target());
        
        target.setFacultyId(facultyId);
        target.setYear(dto.getYear());
            target.setJournalTarget(dto.getJournalTarget() != null ? dto.getJournalTarget() : 0);
            target.setConferenceTarget(dto.getConferenceTarget() != null ? dto.getConferenceTarget() : 0);
            target.setPatentTarget(dto.getPatentTarget() != null ? dto.getPatentTarget() : 0);
            target.setBookChapterTarget(dto.getBookChapterTarget() != null ? dto.getBookChapterTarget() : 0);
        
        if (target.getId() == null) {
            target.setCreatedAt(LocalDateTime.now());
        }
        target.setUpdatedAt(LocalDateTime.now());
        
            System.out.println("Saving target: " + target);
        target = targetRepository.save(target);
            System.out.println("Target saved with ID: " + target.getId());
            
        return convertToDTO(target);
        } catch (Exception e) {
            System.err.println("Error in createOrUpdateTarget: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save target: " + e.getMessage(), e);
        }
    }
    
    public List<TargetDTO> getTargetsByFaculty(String facultyId) {
        return targetRepository.findByFacultyId(facultyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<TargetDTO> getAllTargets() {
        return targetRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private TargetDTO convertToDTO(Target target) {
        TargetDTO dto = new TargetDTO();
        dto.setId(target.getId());
        dto.setYear(target.getYear());
        dto.setJournalTarget(target.getJournalTarget());
        dto.setConferenceTarget(target.getConferenceTarget());
        dto.setPatentTarget(target.getPatentTarget());
        dto.setBookChapterTarget(target.getBookChapterTarget());
        return dto;
    }
}

