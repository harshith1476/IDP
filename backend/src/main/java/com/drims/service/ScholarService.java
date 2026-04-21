package com.drims.service;

import com.drims.entity.FacultyProfile;
import com.drims.entity.Publication;
import com.drims.repository.FacultyProfileRepository;
import com.drims.repository.PublicationRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ScholarService {

    private static final Logger logger = LoggerFactory.getLogger(ScholarService.class);

    @Autowired
    private PublicationRepository publicationRepository;

    @Autowired
    private FacultyProfileRepository facultyProfileRepository;

    @Autowired
    private com.drims.repository.UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    @Qualifier("serpApiRestClient")
    private RestClient serpApiRestClient;

    @Value("${serpapi.key}")
    private String serpApiKey;

    @Autowired
    private com.drims.repository.JournalRepository journalRepository;
    
    @Autowired
    private com.drims.repository.ConferenceRepository conferenceRepository;

    /**
     * STEP 1: MANDATORY RESET
     * Removes all existing publication data.
     */
    public void resetAllPublicationData() {
        logger.warn("MANDATORY RESET: Truncating all publication data...");
        publicationRepository.deleteAll();
        journalRepository.deleteAll();
        conferenceRepository.deleteAll();
        // H2/PostgreSQL will handle sequence reset if configured with IDENTITY
    }

    /**
     * STEP 2: FACULTY INITIALIZATION
     * Creates new faculty accounts with auto-generated credentials.
     */
    public void initializeSystem(List<String> facultyNames) {
        resetAllPublicationData();
        
        for (String name : facultyNames) {
            provisionFaculty(name);
        }
    }

    private void provisionFaculty(String name) {
        String cleanName = name.trim();
        String email = cleanName.toLowerCase().replace(" ", ".") + "@drims.edu";
        
        // 1. Create Faculty Profile
        com.drims.entity.FacultyProfile profile = new com.drims.entity.FacultyProfile();
        profile.setName(cleanName);
        profile.setEmail(email);
        profile = facultyProfileRepository.save(profile);

        // 2. Create User Credentials
        com.drims.entity.User user = new com.drims.entity.User();
        user.setEmail(email);
        user.setFacultyId(profile.getId());
        user.setRole("ROLE_FACULTY");
        user.setPassword(passwordEncoder.encode("password123")); // Default password
        userRepository.save(user);
        
        logger.info("Provisioned faculty: {} with email: {}", cleanName, email);
    }

    /**
     * Normalize publication title: trim and lowercase for comparison
     */
    public String normalizeTitle(String title) {
        if (title == null) return "";
        return title.trim().toLowerCase();
    }

    /**
     * Step 3 & 4: Fetch publications from SerpAPI
     */
    public List<Publication> fetchScholarPublications(String facultyId, String scholarId) {
        try {
            JsonNode response = serpApiRestClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search.json")
                            .queryParam("engine", "google_scholar_author")
                            .queryParam("author_id", scholarId)
                            .queryParam("api_key", serpApiKey)
                            .build())
                    .retrieve()
                    .body(JsonNode.class);

            List<Publication> publications = new ArrayList<>();
            if (response != null && response.has("articles")) {
                for (JsonNode node : response.get("articles")) {
                    Publication pub = new Publication();
                    pub.setFacultyId(facultyId);
                    pub.setTitle(node.get("title").asText());
                    pub.setVenue(node.path("publication").asText("N/A"));
                    pub.setYear(extractYear(node.path("year").asText()));
                    pub.setLink(node.path("link").asText(""));
                    pub.setCitationCount(node.path("citations").path("total").asInt(0));
                    pub.setSource("SCHOLAR");
                    pub.setSynced(true); // Step 8: Lock Mechanism

                    String authorsStr = node.path("authors").asText("");
                    if (!authorsStr.isEmpty()) {
                        pub.setAuthors(List.of(authorsStr.split(", ")));
                    }
                    publications.add(pub);
                }
            }
            return publications;
        } catch (Exception e) {
            logger.error("Error fetching data from SerpAPI: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Step 5: Scheduler for automatic Detection
     */
    @Scheduled(fixedRate = 86400000)
    public void detectUpdatesAllFaculty() {
        logger.info("Auto-detecting Scholar updates...");
        List<FacultyProfile> faculties = facultyProfileRepository.findAll();
        for (FacultyProfile f : faculties) {
            if (f.getScholarId() != null && !f.getScholarId().isEmpty()) {
                checkForUpdates(f);
            }
        }
    }

    private void checkForUpdates(FacultyProfile faculty) {
        List<Publication> latest = fetchScholarPublications(faculty.getId(), faculty.getScholarId());
        boolean newFound = false;
        
        List<Publication> existing = publicationRepository.findByFacultyId(faculty.getId());
        List<String> existingTitles = existing.stream()
                .map(p -> normalizeTitle(p.getTitle()))
                .toList();

        for (Publication p : latest) {
            if (!existingTitles.contains(normalizeTitle(p.getTitle()))) {
                newFound = true;
                break;
            }
        }

        if (newFound && (faculty.getHasUpdate() == null || !faculty.getHasUpdate())) {
            faculty.setHasUpdate(true);
            facultyProfileRepository.save(faculty);
        }
    }

    /**
     * Step 7: Update + Auto Sync (On Click)
     */
    public int syncFacultyScholar(String facultyId) {
        Optional<FacultyProfile> facultyOpt = facultyProfileRepository.findById(facultyId);
        if (facultyOpt.isEmpty() || facultyOpt.get().getScholarId() == null) return 0;

        FacultyProfile faculty = facultyOpt.get();
        List<Publication> latest = fetchScholarPublications(faculty.getId(), faculty.getScholarId());
        
        List<Publication> existing = publicationRepository.findByFacultyId(faculty.getId());
        List<String> existingTitles = existing.stream()
                .map(p -> normalizeTitle(p.getTitle()))
                .toList();

        int addedCount = 0;
        for (Publication p : latest) {
            if (!existingTitles.contains(normalizeTitle(p.getTitle()))) {
                publicationRepository.save(p);
                addedCount++;
            }
        }

        faculty.setHasUpdate(false);
        faculty.setScholarLastUpdated(LocalDateTime.now());
        facultyProfileRepository.save(faculty);
        
        return addedCount;
    }

    private Integer extractYear(String yearStr) {
        if (yearStr == null || yearStr.isEmpty()) return 0;
        try {
            return Integer.parseInt(yearStr.replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return 0;
        }
    }
}
