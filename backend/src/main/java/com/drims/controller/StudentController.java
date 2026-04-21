package com.drims.controller;

import com.drims.dto.JournalDTO;
import com.drims.dto.ConferenceDTO;
import com.drims.dto.StudentProfileDTO;
import com.drims.entity.User;
import com.drims.repository.UserRepository;
import com.drims.service.FileStorageService;
import com.drims.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
public class StudentController {
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    private String getStudentId(Authentication authentication) {
        String identifier = authentication.getName(); // Could be email or registerNumber
        User user = userRepository.findByRegisterNumber(identifier)
                .orElse(userRepository.findByEmail(identifier)
                        .orElseThrow(() -> new RuntimeException("User not found")));
        
        if (user.getStudentId() == null) {
            throw new RuntimeException("Student profile not found for user: " + identifier);
        }
        return user.getStudentId();
    }
    
    private String getRegisterNumber(Authentication authentication) {
        String identifier = authentication.getName(); // For STUDENT: this is registerNumber (from JWT subject)
        // Try registerNumber first (most likely for STUDENT)
        Optional<User> userOpt = userRepository.findByRegisterNumber(identifier);
        if (userOpt.isPresent() && userOpt.get().getRegisterNumber() != null) {
            return userOpt.get().getRegisterNumber();
        }
        // If not found by registerNumber, try by email (shouldn't happen for STUDENT, but handle it)
        User user = userRepository.findByEmail(identifier)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRegisterNumber() != null) {
            return user.getRegisterNumber();
        }
        // If user doesn't have registerNumber, use identifier as-is (fallback)
        return identifier;
    }
    
    // Student Profile
    @GetMapping("/profile")
    public ResponseEntity<StudentProfileDTO> getProfile(Authentication authentication) {
        String registerNumber = getRegisterNumber(authentication);
        StudentProfileDTO dto = studentService.getStudentProfile(registerNumber);
        return ResponseEntity.ok(dto);
    }
    
    // Journal Submission
    @PostMapping("/journals")
    public ResponseEntity<JournalDTO> submitJournal(
            Authentication authentication,
            @Valid @RequestBody JournalDTO dto) {
        String studentId = getStudentId(authentication);
        JournalDTO journal = studentService.submitJournal(studentId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(journal);
    }
    
    @GetMapping("/journals")
    public ResponseEntity<List<JournalDTO>> getMyJournals(Authentication authentication) {
        String studentId = getStudentId(authentication);
        List<JournalDTO> journals = studentService.getStudentJournals(studentId);
        return ResponseEntity.ok(journals);
    }
    
    @GetMapping("/journals/{id}/status")
    public ResponseEntity<JournalDTO> getJournalStatus(
            Authentication authentication,
            @PathVariable String id) {
        String studentId = getStudentId(authentication);
        JournalDTO journal = studentService.getJournalStatus(id, studentId);
        return ResponseEntity.ok(journal);
    }
    
    // Conference Submission
    @PostMapping("/conferences")
    public ResponseEntity<ConferenceDTO> submitConference(
            Authentication authentication,
            @Valid @RequestBody ConferenceDTO dto) {
        String studentId = getStudentId(authentication);
        ConferenceDTO conference = studentService.submitConference(studentId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(conference);
    }
    
    @GetMapping("/conferences")
    public ResponseEntity<List<ConferenceDTO>> getMyConferences(Authentication authentication) {
        String studentId = getStudentId(authentication);
        List<ConferenceDTO> conferences = studentService.getStudentConferences(studentId);
        return ResponseEntity.ok(conferences);
    }
    
    @GetMapping("/conferences/{id}/status")
    public ResponseEntity<ConferenceDTO> getConferenceStatus(
            Authentication authentication,
            @PathVariable String id) {
        String studentId = getStudentId(authentication);
        ConferenceDTO conference = studentService.getConferenceStatus(id, studentId);
        return ResponseEntity.ok(conference);
    }
    
    // File Upload for Students
    @PostMapping("/upload/{category}/{publicationId}")
    public ResponseEntity<String> uploadFile(
            Authentication authentication,
            @PathVariable String category,
            @PathVariable String publicationId,
            @RequestParam("file") MultipartFile file) {
        String studentId = getStudentId(authentication);
        String filePath = fileStorageService.storeFileForStudent(file, studentId, category);
        return ResponseEntity.ok(filePath);
    }
}
