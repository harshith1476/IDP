package com.drims.service;

import com.drims.dto.JournalDTO;
import com.drims.dto.StudentCollaborationDTO;
import com.drims.entity.Journal;
import com.drims.entity.StudentCollaboration;
import com.drims.repository.JournalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class JournalService {
    
    @Autowired
    private JournalRepository journalRepository;
    
    public JournalDTO createJournal(String facultyId, JournalDTO dto) {
        Journal journal = new Journal();
        journal.setFacultyId(facultyId);
        journal.setTitle(dto.getTitle());
        journal.setJournalName(dto.getJournalName());
        journal.setAuthors(dto.getAuthors());
        journal.setCorrespondingAuthors(dto.getCorrespondingAuthors());
        journal.setYear(dto.getYear());
        journal.setVolume(dto.getVolume());
        journal.setIssue(dto.getIssue());
        journal.setPages(dto.getPages());
        journal.setDoi(dto.getDoi());
        journal.setImpactFactor(dto.getImpactFactor());
        journal.setJournalHIndex(dto.getJournalHIndex());
        journal.setStatus(dto.getStatus());
        journal.setCategory(dto.getCategory());
        journal.setIndexType(dto.getIndexType());
        journal.setQuartile(dto.getQuartile());
        journal.setPublisher(dto.getPublisher());
        journal.setIssn(dto.getIssn());
        journal.setOpenAccess(dto.getOpenAccess());
        journal.setApprovalStatus("SUBMITTED");
        
        // Student collaboration
        journal.setCollaboratedWithStudents(dto.getCollaboratedWithStudents());
        if (dto.getStudentCollaborations() != null && !dto.getStudentCollaborations().isEmpty()) {
            journal.setStudentCollaborations(convertStudentCollaborationsFromDTO(dto.getStudentCollaborations()));
        }
        
        // Set file paths - always set them, even if null
        journal.setAcceptanceMailPath(dto.getAcceptanceMailPath());
        journal.setPublishedPaperPath(dto.getPublishedPaperPath());
        journal.setIndexProofPath(dto.getIndexProofPath());
        journal.setProofDocumentPath(dto.getProofDocumentPath()); // Legacy
        
        // Debug logging
        System.out.println("Creating journal with file paths:");
        System.out.println("  acceptanceMailPath: " + dto.getAcceptanceMailPath());
        System.out.println("  publishedPaperPath: " + dto.getPublishedPaperPath());
        System.out.println("  indexProofPath: " + dto.getIndexProofPath());
        
        journal = journalRepository.save(journal);
        
        // Log after save
        System.out.println("Journal saved with ID: " + journal.getId());
        System.out.println("Saved file paths:");
        System.out.println("  acceptanceMailPath: " + journal.getAcceptanceMailPath());
        System.out.println("  publishedPaperPath: " + journal.getPublishedPaperPath());
        System.out.println("  indexProofPath: " + journal.getIndexProofPath());
        
        return convertToDTO(journal);
    }
    
    public JournalDTO updateJournal(String id, String facultyId, JournalDTO dto) {
        Journal journal = journalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Journal not found"));
        
        if (!journal.getFacultyId().equals(facultyId)) {
            throw new RuntimeException("Unauthorized to update this journal");
        }
        
        // Don't allow updates if already approved/locked
        if ("APPROVED".equals(journal.getApprovalStatus()) || "LOCKED".equals(journal.getApprovalStatus())) {
            throw new RuntimeException("Cannot update approved/locked journal");
        }
        
        journal.setTitle(dto.getTitle());
        journal.setJournalName(dto.getJournalName());
        journal.setAuthors(dto.getAuthors());
        journal.setCorrespondingAuthors(dto.getCorrespondingAuthors());
        journal.setYear(dto.getYear());
        journal.setVolume(dto.getVolume());
        journal.setIssue(dto.getIssue());
        journal.setPages(dto.getPages());
        journal.setDoi(dto.getDoi());
        journal.setImpactFactor(dto.getImpactFactor());
        journal.setJournalHIndex(dto.getJournalHIndex());
        journal.setStatus(dto.getStatus());
        journal.setCategory(dto.getCategory());
        journal.setIndexType(dto.getIndexType());
        journal.setQuartile(dto.getQuartile());
        journal.setPublisher(dto.getPublisher());
        journal.setIssn(dto.getIssn());
        journal.setOpenAccess(dto.getOpenAccess());
        
        // Student collaboration
        journal.setCollaboratedWithStudents(dto.getCollaboratedWithStudents());
        if (dto.getStudentCollaborations() != null) {
            journal.setStudentCollaborations(convertStudentCollaborationsFromDTO(dto.getStudentCollaborations()));
        }
        
        // Always update file paths if provided (even if null, to clear old paths)
        if (dto.getAcceptanceMailPath() != null) {
            journal.setAcceptanceMailPath(dto.getAcceptanceMailPath());
        }
        if (dto.getPublishedPaperPath() != null) {
            journal.setPublishedPaperPath(dto.getPublishedPaperPath());
        }
        if (dto.getIndexProofPath() != null) {
            journal.setIndexProofPath(dto.getIndexProofPath());
        }
        if (dto.getProofDocumentPath() != null) {
            journal.setProofDocumentPath(dto.getProofDocumentPath()); // Legacy
        }
        
        // Debug logging
        System.out.println("Updating journal " + journal.getId() + " with file paths:");
        System.out.println("  acceptanceMailPath: " + dto.getAcceptanceMailPath());
        System.out.println("  publishedPaperPath: " + dto.getPublishedPaperPath());
        System.out.println("  indexProofPath: " + dto.getIndexProofPath());
        
        journal = journalRepository.save(journal);
        return convertToDTO(journal);
    }
    
    public List<JournalDTO> getJournalsByFaculty(String facultyId) {
        return journalRepository.findByFacultyId(facultyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<JournalDTO> getAllJournals() {
        return journalRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public void deleteJournal(String id, String facultyId) {
        Journal journal = journalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Journal not found"));
        
        if (!journal.getFacultyId().equals(facultyId)) {
            throw new RuntimeException("Unauthorized to delete this journal");
        }
        
        // Don't allow deletion if already approved/locked
        if ("APPROVED".equals(journal.getApprovalStatus()) || "LOCKED".equals(journal.getApprovalStatus())) {
            throw new RuntimeException("Cannot delete approved/locked journal");
        }
        
        journalRepository.delete(journal);
    }
    
    private JournalDTO convertToDTO(Journal journal) {
        JournalDTO dto = new JournalDTO();
        dto.setId(journal.getId());
        dto.setTitle(journal.getTitle());
        dto.setJournalName(journal.getJournalName());
        dto.setAuthors(journal.getAuthors());
        dto.setCorrespondingAuthors(journal.getCorrespondingAuthors());
        dto.setYear(journal.getYear());
        dto.setVolume(journal.getVolume());
        dto.setIssue(journal.getIssue());
        dto.setPages(journal.getPages());
        dto.setDoi(journal.getDoi());
        dto.setImpactFactor(journal.getImpactFactor());
        dto.setJournalHIndex(journal.getJournalHIndex());
        dto.setStatus(journal.getStatus());
        dto.setCategory(journal.getCategory());
        dto.setIndexType(journal.getIndexType());
        dto.setQuartile(journal.getQuartile());
        dto.setPublisher(journal.getPublisher());
        dto.setIssn(journal.getIssn());
        dto.setOpenAccess(journal.getOpenAccess());
        dto.setApprovalStatus(journal.getApprovalStatus());
        dto.setRemarks(journal.getRemarks());
        dto.setAcceptanceMailPath(journal.getAcceptanceMailPath());
        dto.setPublishedPaperPath(journal.getPublishedPaperPath());
        dto.setIndexProofPath(journal.getIndexProofPath());
        dto.setProofDocumentPath(journal.getProofDocumentPath()); // Legacy
        
        // Student collaboration
        dto.setCollaboratedWithStudents(journal.getCollaboratedWithStudents());
        if (journal.getStudentCollaborations() != null && !journal.getStudentCollaborations().isEmpty()) {
            dto.setStudentCollaborations(convertStudentCollaborationsToDTO(journal.getStudentCollaborations()));
        }
        
        return dto;
    }
    
    private List<StudentCollaboration> convertStudentCollaborationsFromDTO(List<StudentCollaborationDTO> dtos) {
        if (dtos == null) return null;
        return dtos.stream()
                .map(dto -> new StudentCollaboration(
                        dto.getStudentName(),
                        dto.getRegistrationNumber(),
                        dto.getYear(),
                        dto.getGuideName()
                ))
                .collect(Collectors.toList());
    }
    
    private List<StudentCollaborationDTO> convertStudentCollaborationsToDTO(List<StudentCollaboration> collaborations) {
        if (collaborations == null) return null;
        return collaborations.stream()
                .map(collab -> new StudentCollaborationDTO(
                        collab.getStudentName(),
                        collab.getRegistrationNumber(),
                        collab.getAcademicYear(),
                        collab.getGuideName()
                ))
                .collect(Collectors.toList());
    }
}

