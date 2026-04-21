package com.drims.service;

import com.drims.dto.FacultyProfileDTO;
import com.drims.dto.FacultySubmissionDTO;
import com.drims.dto.ResearchMetricsDTO;
import com.drims.entity.Journal;
import com.drims.entity.Conference;
import com.drims.entity.FacultyProfile;
import com.drims.entity.User;
import com.drims.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FacultyProfileService {
    
    @Autowired
    private FacultyProfileRepository facultyProfileRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private ConferenceRepository conferenceRepository;

    @Autowired
    private PatentRepository patentRepository;

    @Autowired
    private BookChapterRepository bookChapterRepository;

    @Autowired
    private BookRepository bookRepository;
    
    public FacultyProfileDTO getProfileByEmail(String email) {
        FacultyProfile profile = facultyProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return convertToDTO(profile);
    }
    
    public FacultyProfileDTO updateProfile(String email, FacultyProfileDTO dto) {
        FacultyProfile profile = facultyProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        
        profile.setName(dto.getName());
        profile.setDesignation(dto.getDesignation());
        profile.setDepartment(dto.getDepartment());
        profile.setResearchAreas(dto.getResearchAreas());
        profile.setPhotoPath(dto.getPhotoPath());
        profile.setDescription(dto.getDescription());
        profile.setOrcidId(dto.getOrcidId());
        profile.setScopusId(dto.getScopusId());
        profile.setGoogleScholarLink(dto.getGoogleScholarLink());
        profile.setHIndex(dto.getHIndex());
        profile.setCitationCount(dto.getCitationCount());
        profile.setSemanticScholarId(dto.getSemanticScholarId());
        profile.setGoogleScholarId(dto.getGoogleScholarId());
        profile.setScholarId(dto.getScholarId());
        profile.setHasUpdate(dto.getHasUpdate() != null ? dto.getHasUpdate() : profile.getHasUpdate());
        profile.setUpdatedAt(LocalDateTime.now());
        
        profile = facultyProfileRepository.save(profile);
        return convertToDTO(profile);
    }

    public String updateProfilePicture(String facultyId, MultipartFile file) {
        FacultyProfile profile = facultyProfileRepository.findById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty profile not found"));

        // Delete old photo if exists to prevent storage leaks
        if (profile.getPhotoPath() != null && !profile.getPhotoPath().isEmpty()) {
            fileStorageService.deleteFile(profile.getPhotoPath());
        }

        // Store new photo using Option A (relative path in DB)
        String photoPath = fileStorageService.storeFile(file, facultyId, "profile-photo");
        profile.setPhotoPath(photoPath);
        profile.setUpdatedAt(LocalDateTime.now());
        facultyProfileRepository.save(profile);
        
        return photoPath;
    }

    public void deleteProfilePicture(String facultyId) {
        FacultyProfile profile = facultyProfileRepository.findById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty profile not found"));

        if (profile.getPhotoPath() != null && !profile.getPhotoPath().isEmpty()) {
            fileStorageService.deleteFile(profile.getPhotoPath());
            profile.setPhotoPath(null);
            profile.setUpdatedAt(LocalDateTime.now());
            facultyProfileRepository.save(profile);
        }
    }
    
    public List<FacultyProfileDTO> getAllProfiles() {
        return facultyProfileRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public FacultyProfileDTO getProfileById(String id) {
        FacultyProfile profile = facultyProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return convertToDTO(profile);
    }
    
    private FacultyProfileDTO convertToDTO(FacultyProfile profile) {
        FacultyProfileDTO dto = new FacultyProfileDTO();
        dto.setId(profile.getId());
        dto.setEmployeeId(profile.getEmployeeId());
        dto.setName(profile.getName());
        dto.setDesignation(profile.getDesignation());
        dto.setDepartment(profile.getDepartment());
        dto.setPhotoPath(profile.getPhotoPath());
        dto.setDescription(profile.getDescription());
        dto.setResearchAreas(profile.getResearchAreas());
        dto.setOrcidId(profile.getOrcidId());
        dto.setScopusId(profile.getScopusId());
        dto.setGoogleScholarLink(profile.getGoogleScholarLink());
        dto.setHIndex(profile.getHIndex());
        dto.setCitationCount(profile.getCitationCount());
        dto.setSemanticScholarId(profile.getSemanticScholarId());
        dto.setGoogleScholarId(profile.getGoogleScholarId());
        dto.setScholarId(profile.getScholarId());
        dto.setScholarLastUpdated(profile.getScholarLastUpdated());
        dto.setHasUpdate(profile.getHasUpdate());
        dto.setEmail(profile.getEmail());
        return dto;
    }

    public List<FacultySubmissionDTO> getFacultySubmissions(int year, String facultyName) {
        List<FacultyProfile> profiles;
        if (facultyName != null && !facultyName.trim().isEmpty()) {
            profiles = facultyProfileRepository.findByNameContainingIgnoreCase(facultyName.trim());
        } else {
            profiles = facultyProfileRepository.findAll();
        }

        return profiles.stream().map(profile -> {
            int count = 0;
            count += journalRepository.countByFacultyIdAndYear(profile.getId(), year);
            count += conferenceRepository.countByFacultyIdAndYear(profile.getId(), year);
            count += patentRepository.countByFacultyIdAndYear(profile.getId(), year);
            count += bookChapterRepository.countByFacultyIdAndYear(profile.getId(), year);
            count += bookRepository.countByFacultyIdAndPublicationYear(profile.getId(), year);

            FacultySubmissionDTO dto = new FacultySubmissionDTO();
            dto.setId(profile.getId());
            dto.setEmployeeId(profile.getEmployeeId());
            dto.setName(profile.getName());
            dto.setDepartment(profile.getDepartment());
            dto.setTotalSubmissions(count);
            dto.setYear(year);
            dto.setSubmissionStatus(count > 0 ? "SUBMITTED" : "NOT SUBMITTED");
            return dto;
        }).collect(Collectors.toList());
    }

    public ResearchMetricsDTO getResearchMetrics(String email) {
        FacultyProfile profile = facultyProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        String facultyId = profile.getId();

        List<Journal> journals = journalRepository.findByFacultyId(facultyId);
        List<Conference> conferences = conferenceRepository.findByFacultyId(facultyId);

        ResearchMetricsDTO metrics = new ResearchMetricsDTO();
        
        // 1. Citations All vs Since 2021
        int totalCitations = 0;
        int recentCitations = 0;
        Map<Integer, Integer> citationsByYear = new TreeMap<>();
        Map<String, Integer> rankings = new HashMap<>();
        rankings.put("Q1", 0); rankings.put("Q2", 0); rankings.put("Q3", 0); rankings.put("Q4", 0); rankings.put("NA", 0);

        List<Integer> allCitations = new ArrayList<>();

        for (Journal j : journals) {
            int citations = j.getCitationCount() != null ? j.getCitationCount() : 0;
            totalCitations += citations;
            if (j.getYear() != null) {
                if (j.getYear() >= 2021) recentCitations += citations;
                citationsByYear.put(j.getYear(), citationsByYear.getOrDefault(j.getYear(), 0) + citations);
            }
            if (citations >= 0) allCitations.add(citations);
            
            String q = j.getQuartile();
            if (q != null && rankings.containsKey(q.toUpperCase())) {
                rankings.put(q.toUpperCase(), rankings.get(q.toUpperCase()) + 1);
            } else {
                rankings.put("NA", rankings.get("NA") + 1);
            }
        }

        for (Conference c : conferences) {
            int citations = c.getCitationCount() != null ? c.getCitationCount() : 0;
            totalCitations += citations;
            if (c.getYear() != null) {
                if (c.getYear() >= 2021) recentCitations += citations;
                citationsByYear.put(c.getYear(), citationsByYear.getOrDefault(c.getYear(), 0) + citations);
            }
            if (citations >= 0) allCitations.add(citations);
        }

        // 2. h-index and i10-index calculation
        allCitations.sort(Collections.reverseOrder());
        int hIndex = 0;
        int i10Index = 0;
        for (int i = 0; i < allCitations.size(); i++) {
            if (allCitations.get(i) >= i + 1) hIndex = i + 1;
            if (allCitations.get(i) >= 10) i10Index++;
        }

        metrics.setCitationsAll(totalCitations);
        metrics.setCitationsSince2021(recentCitations);
        metrics.sethIndexAll(hIndex);
        metrics.setI10IndexAll(i10Index);
        metrics.setCitationsByYear(citationsByYear);
        metrics.setJournalRankings(rankings);

        return metrics;
    }
}

