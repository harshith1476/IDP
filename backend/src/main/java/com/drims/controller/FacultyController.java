package com.drims.controller;

import com.drims.dto.*;
import com.drims.entity.FacultyProfile;
import com.drims.security.JwtTokenProvider;
import com.drims.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = "*")
public class FacultyController {
    
    @Autowired
    private FacultyProfileService facultyProfileService;
    
    @Autowired
    private TargetService targetService;
    
    @Autowired
    private JournalService journalService;
    
    @Autowired
    private ConferenceService conferenceService;
    
    @Autowired
    private PatentService patentService;
    
    @Autowired
    private BookChapterService bookChapterService;
    
    @Autowired
    private BookService bookService;
    
    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private ScholarService scholarService;
    
    private String getFacultyId(Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("Authentication required. Please log in again.");
        }
        String email = authentication.getName();
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("User email not found in authentication. Please log in again.");
        }
        FacultyProfile profile = authService.getCurrentFacultyProfile(email);
        return profile.getId();
    }
    
    // Profile Management
    @GetMapping("/profile")
    public ResponseEntity<FacultyProfileDTO> getProfile(Authentication authentication) {
        String email = authentication.getName();
        FacultyProfileDTO profile = facultyProfileService.getProfileByEmail(email);
        return ResponseEntity.ok(profile);
    }
    
    @PutMapping("/profile")
    public ResponseEntity<FacultyProfileDTO> updateProfile(
            Authentication authentication,
            @Valid @RequestBody FacultyProfileDTO dto) {
        String email = authentication.getName();
        FacultyProfileDTO updated = facultyProfileService.updateProfile(email, dto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/research-metrics")
    public ResponseEntity<ResearchMetricsDTO> getResearchMetrics(Authentication authentication) {
        String email = authentication.getName();
        ResearchMetricsDTO metrics = facultyProfileService.getResearchMetrics(email);
        return ResponseEntity.ok(metrics);
    }

    // Profile Picture REST APIs
    @PostMapping("/{id}/profile-picture")
    public ResponseEntity<String> uploadProfilePicture(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        try {
            String photoPath = facultyProfileService.updateProfilePicture(id, file);
            return ResponseEntity.ok(photoPath);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to upload profile picture: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/profile-picture")
    public ResponseEntity<Resource> getProfilePicture(@PathVariable String id) {
        try {
            FacultyProfileDTO profile = facultyProfileService.getProfileById(id);
            if (profile.getPhotoPath() == null || profile.getPhotoPath().isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Resource resource = fileStorageService.loadFileAsResource(profile.getPhotoPath());
            
            // Determine content type based on path
            String contentType = "image/jpeg";
            if (profile.getPhotoPath().toLowerCase().endsWith(".png")) {
                contentType = "image/png";
            }
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/profile-picture")
    public ResponseEntity<String> updateProfilePicture(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        return uploadProfilePicture(id, file);
    }

    @DeleteMapping("/{id}/profile-picture")
    public ResponseEntity<Void> deleteProfilePicture(@PathVariable String id) {
        try {
            facultyProfileService.deleteProfilePicture(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Target Management
    @GetMapping("/targets")
    public ResponseEntity<List<TargetDTO>> getTargets(Authentication authentication) {
        String facultyId = getFacultyId(authentication);
        List<TargetDTO> targets = targetService.getTargetsByFaculty(facultyId);
        return ResponseEntity.ok(targets);
    }
    
    @PostMapping("/targets")
    public ResponseEntity<?> createOrUpdateTarget(
            Authentication authentication,
            @Valid @RequestBody TargetDTO dto) {
        try {
            if (authentication == null) {
                System.err.println("Target creation failed: Authentication is null");
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Authentication required. Please log in again.");
            }
            
            String email = authentication.getName();
            System.out.println("Creating/updating target for email: " + email);
            
        String facultyId = getFacultyId(authentication);
            System.out.println("Faculty ID: " + facultyId);
            System.out.println("Target data: " + dto);
            
        TargetDTO target = targetService.createOrUpdateTarget(facultyId, dto);
            System.out.println("Target saved successfully: " + target.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(target);
        } catch (RuntimeException e) {
            System.err.println("Error creating/updating target: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error saving target: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error creating/updating target: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Unexpected error: " + e.getMessage());
        }
    }
    
    // Journal Management
    @GetMapping("/journals")
    public ResponseEntity<List<JournalDTO>> getJournals(Authentication authentication) {
        String facultyId = getFacultyId(authentication);
        List<JournalDTO> journals = journalService.getJournalsByFaculty(facultyId);
        return ResponseEntity.ok(journals);
    }
    
    @PostMapping("/journals")
    public ResponseEntity<JournalDTO> createJournal(
            Authentication authentication,
            @Valid @RequestBody JournalDTO dto) {
        String facultyId = getFacultyId(authentication);
        JournalDTO journal = journalService.createJournal(facultyId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(journal);
    }
    
    @PutMapping("/journals/{id}")
    public ResponseEntity<JournalDTO> updateJournal(
            Authentication authentication,
            @PathVariable String id,
            @Valid @RequestBody JournalDTO dto) {
        String facultyId = getFacultyId(authentication);
        JournalDTO journal = journalService.updateJournal(id, facultyId, dto);
        return ResponseEntity.ok(journal);
    }
    
    @DeleteMapping("/journals/{id}")
    public ResponseEntity<Void> deleteJournal(
            Authentication authentication,
            @PathVariable String id) {
        String facultyId = getFacultyId(authentication);
        journalService.deleteJournal(id, facultyId);
        return ResponseEntity.noContent().build();
    }
    
    // Conference Management
    @GetMapping("/conferences")
    public ResponseEntity<List<ConferenceDTO>> getConferences(Authentication authentication) {
        String facultyId = getFacultyId(authentication);
        List<ConferenceDTO> conferences = conferenceService.getConferencesByFaculty(facultyId);
        return ResponseEntity.ok(conferences);
    }
    
    @PostMapping("/conferences")
    public ResponseEntity<ConferenceDTO> createConference(
            Authentication authentication,
            @Valid @RequestBody ConferenceDTO dto) {
        String facultyId = getFacultyId(authentication);
        ConferenceDTO conference = conferenceService.createConference(facultyId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(conference);
    }
    
    @PutMapping("/conferences/{id}")
    public ResponseEntity<ConferenceDTO> updateConference(
            Authentication authentication,
            @PathVariable String id,
            @Valid @RequestBody ConferenceDTO dto) {
        String facultyId = getFacultyId(authentication);
        ConferenceDTO conference = conferenceService.updateConference(id, facultyId, dto);
        return ResponseEntity.ok(conference);
    }
    
    @DeleteMapping("/conferences/{id}")
    public ResponseEntity<Void> deleteConference(
            Authentication authentication,
            @PathVariable String id) {
        String facultyId = getFacultyId(authentication);
        conferenceService.deleteConference(id, facultyId);
        return ResponseEntity.noContent().build();
    }
    
    // Patent Management
    @GetMapping("/patents")
    public ResponseEntity<List<PatentDTO>> getPatents(Authentication authentication) {
        String facultyId = getFacultyId(authentication);
        List<PatentDTO> patents = patentService.getPatentsByFaculty(facultyId);
        return ResponseEntity.ok(patents);
    }
    
    @PostMapping("/patents")
    public ResponseEntity<PatentDTO> createPatent(
            Authentication authentication,
            @Valid @RequestBody PatentDTO dto) {
        String facultyId = getFacultyId(authentication);
        PatentDTO patent = patentService.createPatent(facultyId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(patent);
    }
    
    @PutMapping("/patents/{id}")
    public ResponseEntity<PatentDTO> updatePatent(
            Authentication authentication,
            @PathVariable String id,
            @Valid @RequestBody PatentDTO dto) {
        String facultyId = getFacultyId(authentication);
        PatentDTO patent = patentService.updatePatent(id, facultyId, dto);
        return ResponseEntity.ok(patent);
    }
    
    @DeleteMapping("/patents/{id}")
    public ResponseEntity<Void> deletePatent(
            Authentication authentication,
            @PathVariable String id) {
        String facultyId = getFacultyId(authentication);
        patentService.deletePatent(id, facultyId);
        return ResponseEntity.noContent().build();
    }
    
    // Book Chapter Management
    @GetMapping("/book-chapters")
    public ResponseEntity<List<BookChapterDTO>> getBookChapters(Authentication authentication) {
        String facultyId = getFacultyId(authentication);
        List<BookChapterDTO> bookChapters = bookChapterService.getBookChaptersByFaculty(facultyId);
        return ResponseEntity.ok(bookChapters);
    }
    
    @PostMapping("/book-chapters")
    public ResponseEntity<BookChapterDTO> createBookChapter(
            Authentication authentication,
            @Valid @RequestBody BookChapterDTO dto) {
        String facultyId = getFacultyId(authentication);
        BookChapterDTO bookChapter = bookChapterService.createBookChapter(facultyId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(bookChapter);
    }
    
    @PutMapping("/book-chapters/{id}")
    public ResponseEntity<BookChapterDTO> updateBookChapter(
            Authentication authentication,
            @PathVariable String id,
            @Valid @RequestBody BookChapterDTO dto) {
        String facultyId = getFacultyId(authentication);
        BookChapterDTO bookChapter = bookChapterService.updateBookChapter(id, facultyId, dto);
        return ResponseEntity.ok(bookChapter);
    }
    
    @DeleteMapping("/book-chapters/{id}")
    public ResponseEntity<Void> deleteBookChapter(
            Authentication authentication,
            @PathVariable String id) {
        String facultyId = getFacultyId(authentication);
        bookChapterService.deleteBookChapter(id, facultyId);
        return ResponseEntity.noContent().build();
    }
    
    // Book Management
    @GetMapping("/books")
    public ResponseEntity<List<com.drims.dto.BookDTO>> getBooks(Authentication authentication) {
        String facultyId = getFacultyId(authentication);
        List<com.drims.dto.BookDTO> books = bookService.getBooksByFaculty(facultyId);
        return ResponseEntity.ok(books);
    }
    
    @PostMapping("/books")
    public ResponseEntity<com.drims.dto.BookDTO> createBook(
            Authentication authentication,
            @Valid @RequestBody com.drims.dto.BookDTO dto) {
        String facultyId = getFacultyId(authentication);
        com.drims.dto.BookDTO book = bookService.createBook(facultyId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(book);
    }
    
    @PutMapping("/books/{id}")
    public ResponseEntity<com.drims.dto.BookDTO> updateBook(
            Authentication authentication,
            @PathVariable String id,
            @Valid @RequestBody com.drims.dto.BookDTO dto) {
        String facultyId = getFacultyId(authentication);
        com.drims.dto.BookDTO book = bookService.updateBook(id, facultyId, dto);
        return ResponseEntity.ok(book);
    }
    
    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> deleteBook(
            Authentication authentication,
            @PathVariable String id) {
        String facultyId = getFacultyId(authentication);
        bookService.deleteBook(id, facultyId);
        return ResponseEntity.noContent().build();
    }
    
    // Project Management
    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDTO>> getProjects(Authentication authentication) {
        String facultyId = getFacultyId(authentication);
        List<ProjectDTO> projects = projectService.getProjectsByFaculty(facultyId);
        return ResponseEntity.ok(projects);
    }
    
    @PostMapping("/projects")
    public ResponseEntity<ProjectDTO> createProject(
            Authentication authentication,
            @Valid @RequestBody ProjectDTO dto) {
        String facultyId = getFacultyId(authentication);
        ProjectDTO project = projectService.createProject(facultyId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(project);
    }
    
    @PutMapping("/projects/{id}")
    public ResponseEntity<ProjectDTO> updateProject(
            Authentication authentication,
            @PathVariable String id,
            @Valid @RequestBody ProjectDTO dto) {
        String facultyId = getFacultyId(authentication);
        ProjectDTO project = projectService.updateProject(id, facultyId, dto);
        return ResponseEntity.ok(project);
    }
    
    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Void> deleteProject(
            Authentication authentication,
            @PathVariable String id) {
        String facultyId = getFacultyId(authentication);
        projectService.deleteProject(id, facultyId);
        return ResponseEntity.noContent().build();
    }
    
    // File Upload
    @PostMapping("/upload/{category}/{publicationId}")
    public ResponseEntity<String> uploadFile(
            Authentication authentication,
            @PathVariable String category,
            @PathVariable String publicationId,
            @RequestParam("file") MultipartFile file) {
        String facultyId = getFacultyId(authentication);
        String filePath = fileStorageService.storeFile(file, facultyId, category);
        return ResponseEntity.ok(filePath);
    }

    @PostMapping("/update-scholar/{facultyId}")
    public ResponseEntity<Integer> updateScholarData(@PathVariable String facultyId) {
        int newCount = scholarService.syncFacultyScholar(facultyId);
        return ResponseEntity.ok(newCount);
    }
}

