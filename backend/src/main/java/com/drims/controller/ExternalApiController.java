package com.drims.controller;

import com.drims.dto.ExternalAuthorDTO;
import com.drims.dto.ExternalPaperDTO;
import com.drims.dto.FacultyProfileDTO;
import com.drims.service.ExternalApiService;
import com.drims.service.FacultyProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/external")
@CrossOrigin(origins = "*")
public class ExternalApiController {

    @Autowired
    private ExternalApiService externalApiService;

    @Autowired
    private FacultyProfileService facultyProfileService;

    @GetMapping("/semantic-scholar/search")
    public ResponseEntity<List<ExternalAuthorDTO>> searchAuthors(@RequestParam String name) {
        return ResponseEntity.ok(externalApiService.searchSemanticScholarAuthors(name));
    }

    @GetMapping("/semantic-scholar/author/{authorId}/papers")
    public ResponseEntity<List<ExternalPaperDTO>> getAuthorPapers(@PathVariable String authorId) {
        return ResponseEntity.ok(externalApiService.getSemanticScholarPapers(authorId));
    }

    @GetMapping("/orcid/search")
    public ResponseEntity<List<ExternalAuthorDTO>> searchOrcid(@RequestParam String name) {
        return ResponseEntity.ok(externalApiService.searchOrcidAuthors(name));
    }

    @GetMapping("/orcid/{orcidId}/works")
    public ResponseEntity<List<ExternalPaperDTO>> getOrcidWorks(@PathVariable String orcidId) {
        return ResponseEntity.ok(externalApiService.getOrcidWorks(orcidId));
    }

    @GetMapping("/google-scholar/search")
    public ResponseEntity<List<ExternalAuthorDTO>> searchGoogleScholar(@RequestParam String name) {
        return ResponseEntity.ok(externalApiService.searchGoogleScholarAuthors(name));
    }

    @GetMapping("/google-scholar/author/{authorId}/papers")
    public ResponseEntity<List<ExternalPaperDTO>> getGoogleScholarPapers(@PathVariable String authorId) {
        return ResponseEntity.ok(externalApiService.getGoogleScholarPapers(authorId));
    }

    @PostMapping("/sync-profile")
    public ResponseEntity<FacultyProfileDTO> syncProfile(
            Authentication authentication,
            @RequestBody ExternalAuthorDTO authorInfo) {
        String email = authentication.getName();
        FacultyProfileDTO profile = facultyProfileService.getProfileByEmail(email);
        
        // Update profile with bibliometrics
        profile.setHIndex(authorInfo.getHIndex() != null ? authorInfo.getHIndex() : profile.getHIndex());
        profile.setCitationCount(authorInfo.getCitationCount() != null ? authorInfo.getCitationCount() : profile.getCitationCount());
        
        if ("GoogleScholar".equals(authorInfo.getSource())) {
            profile.setGoogleScholarId(authorInfo.getExternalId());
        } else {
            profile.setSemanticScholarId(authorInfo.getExternalId());
        }
        
        if (authorInfo.getOrcid() != null) {
            profile.setOrcidId(authorInfo.getOrcid());
        }
        
        FacultyProfileDTO updated = facultyProfileService.updateProfile(email, profile);
        
        // Also trigger an immediate paper sync from this specific source
        externalApiService.syncAllPapers(email);
        
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/sync-papers")
    public ResponseEntity<Integer> syncPapers(Authentication authentication) {
        String email = authentication.getName();
        int count = externalApiService.syncAllPapers(email);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/import-papers")
    public ResponseEntity<Integer> importPapers(
            Authentication authentication,
            @RequestBody List<ExternalPaperDTO> papers) {
        String email = authentication.getName();
        int count = externalApiService.importPapers(papers, email);
        return ResponseEntity.ok(count);
    }
}
