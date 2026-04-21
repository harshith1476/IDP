package com.drims.service;

import com.drims.dto.JournalDTO;
import com.drims.dto.ConferenceDTO;
import com.drims.dto.StudentProfileDTO;
import com.drims.entity.*;
import com.drims.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private ConferenceRepository conferenceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FacultyProfileRepository facultyProfileRepository;

    // Student Profile Methods
    public StudentProfileDTO getStudentProfile(String registerNumber) {
        StudentProfile profile = studentProfileRepository.findByRegisterNumber(registerNumber)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
        return convertToDTO(profile);
    }

    // Journal Submission Methods
    public JournalDTO submitJournal(String studentId, JournalDTO dto) {
        Journal journal = new Journal();
        journal.setStudentId(studentId);
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
        journal.setStatus(dto.getStatus());
        journal.setCategory(dto.getCategory());
        journal.setIndexType(dto.getIndexType());
        journal.setPublisher(dto.getPublisher());
        journal.setIssn(dto.getIssn());
        journal.setOpenAccess(dto.getOpenAccess());
        journal.setApprovalStatus("SUBMITTED");
        journal.setAcceptanceMailPath(dto.getAcceptanceMailPath());
        journal.setPublishedPaperPath(dto.getPublishedPaperPath());
        journal.setIndexProofPath(dto.getIndexProofPath());
        journal.setProofDocumentPath(dto.getProofDocumentPath()); // Legacy
        journal.setCreatedAt(LocalDateTime.now());
        journal.setUpdatedAt(LocalDateTime.now());

        journal = journalRepository.save(journal);
        return convertJournalToDTO(journal);
    }

    public List<JournalDTO> getStudentJournals(String studentId) {
        return journalRepository.findByStudentId(studentId).stream()
                .map(this::convertJournalToDTO)
                .collect(Collectors.toList());
    }

    public JournalDTO getJournalStatus(String journalId, String studentId) {
        Journal journal = journalRepository.findById(journalId)
                .orElseThrow(() -> new RuntimeException("Journal not found"));

        if (!journal.getStudentId().equals(studentId)) {
            throw new RuntimeException("Unauthorized to view this journal");
        }

        return convertJournalToDTO(journal);
    }

    // Conference Submission Methods
    public ConferenceDTO submitConference(String studentId, ConferenceDTO dto) {
        Conference conference = new Conference();
        conference.setStudentId(studentId);
        conference.setTitle(dto.getTitle());
        conference.setConferenceName(dto.getConferenceName());
        conference.setOrganizer(dto.getOrganizer());
        conference.setAuthors(dto.getAuthors());
        conference.setYear(dto.getYear());
        conference.setLocation(dto.getLocation());
        conference.setDate(dto.getDate());
        conference.setStatus(dto.getStatus());
        conference.setCategory(dto.getCategory());
        conference.setRegistrationAmount(dto.getRegistrationAmount());
        conference.setPaymentMode(dto.getPaymentMode());
        conference.setIsStudentPublication(true);
        conference.setStudentName(dto.getStudentName());
        conference.setStudentRegisterNumber(dto.getStudentRegisterNumber());
        conference.setGuideId(dto.getGuideId());
        conference.setGuideName(dto.getGuideName());
        conference.setApprovalStatus("SUBMITTED");
        conference.setRegistrationReceiptPath(dto.getRegistrationReceiptPath());
        conference.setCertificatePath(dto.getCertificatePath());
        conference.setPublishedPaperPath(dto.getPublishedPaperPath());
        conference.setProofDocumentPath(dto.getProofDocumentPath()); // Legacy
        conference.setCreatedAt(LocalDateTime.now());
        conference.setUpdatedAt(LocalDateTime.now());

        conference = conferenceRepository.save(conference);
        return convertConferenceToDTO(conference);
    }

    public List<ConferenceDTO> getStudentConferences(String studentId) {
        return conferenceRepository.findByStudentId(studentId).stream()
                .map(this::convertConferenceToDTO)
                .collect(Collectors.toList());
    }

    public ConferenceDTO getConferenceStatus(String conferenceId, String studentId) {
        Conference conference = conferenceRepository.findById(conferenceId)
                .orElseThrow(() -> new RuntimeException("Conference not found"));

        if (!conference.getStudentId().equals(studentId)) {
            throw new RuntimeException("Unauthorized to view this conference");
        }

        return convertConferenceToDTO(conference);
    }

    // DTO Conversion Methods
    private StudentProfileDTO convertToDTO(StudentProfile profile) {
        StudentProfileDTO dto = new StudentProfileDTO();
        dto.setId(profile.getId());
        dto.setRegisterNumber(profile.getRegisterNumber());
        dto.setName(profile.getName());
        dto.setDepartment(profile.getDepartment());
        dto.setProgram(profile.getProgram());
        dto.setYear(profile.getYear());
        dto.setGuideId(profile.getGuideId());
        dto.setGuideName(profile.getGuideName());
        return dto;
    }

    private JournalDTO convertJournalToDTO(Journal journal) {
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
        dto.setStatus(journal.getStatus());
        dto.setCategory(journal.getCategory());
        dto.setIndexType(journal.getIndexType());
        dto.setPublisher(journal.getPublisher());
        dto.setIssn(journal.getIssn());
        dto.setOpenAccess(journal.getOpenAccess());
        dto.setApprovalStatus(journal.getApprovalStatus());
        dto.setRemarks(journal.getRemarks());
        dto.setAcceptanceMailPath(journal.getAcceptanceMailPath());
        dto.setPublishedPaperPath(journal.getPublishedPaperPath());
        dto.setIndexProofPath(journal.getIndexProofPath());
        dto.setProofDocumentPath(journal.getProofDocumentPath()); // Legacy
        return dto;
    }

    private ConferenceDTO convertConferenceToDTO(Conference conference) {
        ConferenceDTO dto = new ConferenceDTO();
        dto.setId(conference.getId());
        dto.setTitle(conference.getTitle());
        dto.setConferenceName(conference.getConferenceName());
        dto.setOrganizer(conference.getOrganizer());
        dto.setAuthors(conference.getAuthors());
        dto.setYear(conference.getYear());
        dto.setLocation(conference.getLocation());
        dto.setDate(conference.getDate());
        dto.setStatus(conference.getStatus());
        dto.setCategory(conference.getCategory());
        dto.setRegistrationAmount(conference.getRegistrationAmount());
        dto.setPaymentMode(conference.getPaymentMode());
        dto.setStudentName(conference.getStudentName());
        dto.setStudentRegisterNumber(conference.getStudentRegisterNumber());
        dto.setGuideId(conference.getGuideId());
        dto.setGuideName(conference.getGuideName());
        dto.setApprovalStatus(conference.getApprovalStatus());
        dto.setRemarks(conference.getRemarks());
        dto.setRegistrationReceiptPath(conference.getRegistrationReceiptPath());
        dto.setCertificatePath(conference.getCertificatePath());
        dto.setPublishedPaperPath(conference.getPublishedPaperPath());
        dto.setProofDocumentPath(conference.getProofDocumentPath()); // Legacy
        return dto;
    }
}
