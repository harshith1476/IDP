package com.drims.service;

import com.drims.dto.PatentDTO;
import com.drims.entity.Patent;
import com.drims.repository.PatentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatentService {
    
    @Autowired
    private PatentRepository patentRepository;
    
    public PatentDTO createPatent(String facultyId, PatentDTO dto) {
        Patent patent = new Patent();
        patent.setFacultyId(facultyId);
        patent.setTitle(dto.getTitle());
        patent.setApplicationNumber(dto.getApplicationNumber());
        patent.setFilingDate(dto.getFilingDate());
        patent.setPatentNumber(dto.getPatentNumber());
        patent.setInventors(dto.getInventors());
        patent.setCorrespondingInventors(dto.getCorrespondingInventors());
        patent.setYear(dto.getYear());
        patent.setCountry(dto.getCountry());
        patent.setStatus(dto.getStatus());
        patent.setCategory(dto.getCategory());
        patent.setDoi(dto.getDoi());
        patent.setPublisher(dto.getPublisher());
        patent.setVolume(dto.getVolume());
        patent.setImpactFactor(dto.getImpactFactor());
        patent.setJournalHIndex(dto.getJournalHIndex());
        patent.setApprovalStatus("SUBMITTED");
        patent.setFilingProofPath(dto.getFilingProofPath());
        patent.setPublicationCertificatePath(dto.getPublicationCertificatePath());
        patent.setGrantCertificatePath(dto.getGrantCertificatePath());
        patent.setProofDocumentPath(dto.getProofDocumentPath()); // Legacy
        
        patent = patentRepository.save(patent);
        return convertToDTO(patent);
    }
    
    public PatentDTO updatePatent(String id, String facultyId, PatentDTO dto) {
        Patent patent = patentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patent not found"));
        
        if (!patent.getFacultyId().equals(facultyId)) {
            throw new RuntimeException("Unauthorized to update this patent");
        }
        
        // Don't allow updates if already approved/locked
        if ("APPROVED".equals(patent.getApprovalStatus()) || "LOCKED".equals(patent.getApprovalStatus())) {
            throw new RuntimeException("Cannot update approved/locked patent");
        }
        
        patent.setTitle(dto.getTitle());
        patent.setApplicationNumber(dto.getApplicationNumber());
        patent.setFilingDate(dto.getFilingDate());
        patent.setPatentNumber(dto.getPatentNumber());
        patent.setInventors(dto.getInventors());
        patent.setCorrespondingInventors(dto.getCorrespondingInventors());
        patent.setYear(dto.getYear());
        patent.setCountry(dto.getCountry());
        patent.setStatus(dto.getStatus());
        patent.setCategory(dto.getCategory());
        patent.setDoi(dto.getDoi());
        patent.setPublisher(dto.getPublisher());
        patent.setVolume(dto.getVolume());
        patent.setImpactFactor(dto.getImpactFactor());
        patent.setJournalHIndex(dto.getJournalHIndex());
        if (dto.getFilingProofPath() != null) {
            patent.setFilingProofPath(dto.getFilingProofPath());
        }
        if (dto.getPublicationCertificatePath() != null) {
            patent.setPublicationCertificatePath(dto.getPublicationCertificatePath());
        }
        if (dto.getGrantCertificatePath() != null) {
            patent.setGrantCertificatePath(dto.getGrantCertificatePath());
        }
        if (dto.getProofDocumentPath() != null) {
            patent.setProofDocumentPath(dto.getProofDocumentPath()); // Legacy
        }
        
        patent = patentRepository.save(patent);
        return convertToDTO(patent);
    }
    
    public List<PatentDTO> getPatentsByFaculty(String facultyId) {
        return patentRepository.findByFacultyId(facultyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PatentDTO> getAllPatents() {
        return patentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public void deletePatent(String id, String facultyId) {
        Patent patent = patentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patent not found"));
        
        if (!patent.getFacultyId().equals(facultyId)) {
            throw new RuntimeException("Unauthorized to delete this patent");
        }
        
        // Don't allow deletion if already approved/locked
        if ("APPROVED".equals(patent.getApprovalStatus()) || "LOCKED".equals(patent.getApprovalStatus())) {
            throw new RuntimeException("Cannot delete approved/locked patent");
        }
        
        patentRepository.delete(patent);
    }
    
    private PatentDTO convertToDTO(Patent patent) {
        PatentDTO dto = new PatentDTO();
        dto.setId(patent.getId());
        dto.setTitle(patent.getTitle());
        dto.setApplicationNumber(patent.getApplicationNumber());
        dto.setFilingDate(patent.getFilingDate());
        dto.setPatentNumber(patent.getPatentNumber());
        dto.setInventors(patent.getInventors());
        dto.setCorrespondingInventors(patent.getCorrespondingInventors());
        dto.setYear(patent.getYear());
        dto.setCountry(patent.getCountry());
        dto.setStatus(patent.getStatus());
        dto.setCategory(patent.getCategory());
        dto.setDoi(patent.getDoi());
        dto.setPublisher(patent.getPublisher());
        dto.setVolume(patent.getVolume());
        dto.setImpactFactor(patent.getImpactFactor());
        dto.setJournalHIndex(patent.getJournalHIndex());
        dto.setApprovalStatus(patent.getApprovalStatus());
        dto.setRemarks(patent.getRemarks());
        dto.setFilingProofPath(patent.getFilingProofPath());
        dto.setPublicationCertificatePath(patent.getPublicationCertificatePath());
        dto.setGrantCertificatePath(patent.getGrantCertificatePath());
        dto.setProofDocumentPath(patent.getProofDocumentPath()); // Legacy
        return dto;
    }
}

