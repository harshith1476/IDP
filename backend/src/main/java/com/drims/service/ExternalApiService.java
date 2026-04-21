package com.drims.service;

import com.drims.dto.ExternalAuthorDTO;
import com.drims.dto.ExternalPaperDTO;
import com.drims.entity.Journal;
import com.drims.repository.ConferenceRepository;
import com.drims.repository.FacultyProfileRepository;
import com.drims.repository.JournalRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExternalApiService {

    @Autowired
    @Qualifier("semanticScholarRestClient")
    private RestClient semanticScholarRestClient;

    @Autowired
    @Qualifier("orcidRestClient")
    private RestClient orcidRestClient;

    @Autowired
    @Qualifier("serpApiRestClient")
    private RestClient serpApiRestClient;

    @org.springframework.beans.factory.annotation.Value("${serpapi.key:}")
    private String serpApiKey;

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private ConferenceRepository conferenceRepository;

    @Autowired
    private FacultyProfileRepository facultyProfileRepository;

    // --- Semantic Scholar Methods ---

    public List<ExternalAuthorDTO> searchSemanticScholarAuthors(String name) {
        JsonNode response = semanticScholarRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/author/search")
                        .queryParam("query", name)
                        .queryParam("fields", "authorId,name,url,hIndex,citationCount,paperCount,externalIds")
                        .build())
                .retrieve()
                .body(JsonNode.class);

        List<ExternalAuthorDTO> authors = new ArrayList<>();
        if (response != null && response.has("data")) {
            for (JsonNode node : response.get("data")) {
                ExternalAuthorDTO dto = new ExternalAuthorDTO();
                dto.setExternalId(node.get("authorId").asText());
                dto.setName(node.get("name").asText());
                dto.setUrl(node.path("url").asText());
                dto.setHIndex(node.path("hIndex").asInt(0));
                dto.setCitationCount(node.path("citationCount").asInt(0));
                dto.setPaperCount(node.path("paperCount").asInt(0));
                dto.setSource("SemanticScholar");
                if (node.has("externalIds") && node.get("externalIds").has("ORCID")) {
                    dto.setOrcid(node.get("externalIds").get("ORCID").asText());
                }
                authors.add(dto);
            }
        }
        return authors;
    }

    public List<ExternalPaperDTO> getSemanticScholarPapers(String authorId) {
        JsonNode response = semanticScholarRestClient.get()
                .uri("/author/" + authorId + "/papers?fields=paperId,title,venue,year,externalIds,authors,citationCount,abstract")
                .retrieve()
                .body(JsonNode.class);

        List<ExternalPaperDTO> papers = new ArrayList<>();
        if (response != null && response.has("data")) {
            for (JsonNode node : response.get("data")) {
                ExternalPaperDTO dto = new ExternalPaperDTO();
                dto.setExternalId(node.get("paperId").asText());
                dto.setTitle(node.get("title").asText());
                dto.setVenue(node.path("venue").asText("N/A"));
                dto.setYear(node.path("year").asInt(0));
                dto.setCitationCount(node.path("citationCount").asInt(0));
                dto.setAbstractText(node.path("abstract").asText(""));
                
                if (node.has("externalIds") && node.get("externalIds").has("DOI")) {
                    dto.setDoi(node.get("externalIds").get("DOI").asText());
                }
                
                // Get authors as List
                if (node.has("authors")) {
                    List<String> authorNames = new ArrayList<>();
                    for (JsonNode author : node.get("authors")) {
                        authorNames.add(author.get("name").asText());
                    }
                    dto.setAuthors(authorNames);
                }
                
                papers.add(dto);
            }
        }
        return papers;
    }

    public int syncAllPapers(String email) {
        var profileOpt = facultyProfileRepository.findByEmail(email);
        if (profileOpt.isEmpty()) return 0;
        var profile = profileOpt.get();
        int totalImported = 0;

        // 1. Sync from Semantic Scholar
        String scholarId = profile.getSemanticScholarId();
        if (scholarId != null && !scholarId.isEmpty()) {
            List<ExternalPaperDTO> externalPapers = getSemanticScholarPapers(scholarId);
            totalImported += importPapers(externalPapers, email);
        }

        // 2. Sync from Google Scholar (SerpApi)
        String googleId = profile.getGoogleScholarId();
        if (googleId != null && !googleId.isEmpty()) {
            List<ExternalPaperDTO> googlePapers = getGoogleScholarPapers(googleId);
            totalImported += importPapers(googlePapers, email);
        }

        // 3. Sync from ORCID
        String orcidId = profile.getOrcidId();
        if (orcidId != null && !orcidId.isEmpty()) {
            List<ExternalPaperDTO> orcidPapers = getOrcidWorks(orcidId);
            totalImported += importPapers(orcidPapers, email);
        }

        return totalImported;
    }

    public int importPapers(List<ExternalPaperDTO> papers, String email) {
        var profileOpt = facultyProfileRepository.findByEmail(email);
        if (profileOpt.isEmpty()) return 0;
        var profile = profileOpt.get();
        int importedCount = 0;

        for (ExternalPaperDTO dto : papers) {
            if (savePaper(dto, profile.getId())) {
                importedCount++;
            }
        }
        return importedCount;
    }

    private boolean savePaper(ExternalPaperDTO dto, String facultyId) {
        String title = dto.getTitle();
        String doi = dto.getDoi();
        
        // --- Deduplication & Removal Logic ---
        // 1. Clean up existing duplicates by DOI
        if (doi != null && !doi.isEmpty() && !doi.equals("-")) {
            journalRepository.findAllByDoi(doi).forEach(j -> journalRepository.delete(j));
            conferenceRepository.findAllByDoi(doi).forEach(c -> conferenceRepository.delete(c));
        }
        
        // 2. Clean up existing duplicates by Title (Exact match, ignore case) for this faculty
        if (title != null && !title.isEmpty()) {
            journalRepository.findAllByTitleIgnoreCaseAndFacultyId(title, facultyId).forEach(j -> journalRepository.delete(j));
            conferenceRepository.findAllByTitleIgnoreCaseAndFacultyId(title, facultyId).forEach(c -> conferenceRepository.delete(c));
        }

        // --- Create New Entry ---
        // Determine if it should be a Journal or Conference
        boolean isConference = false;
        if (dto.getType() != null && (dto.getType().contains("proceedings") || dto.getType().contains("conference"))) {
            isConference = true;
        } else if (dto.getVenue() != null) {
            String venue = dto.getVenue().toLowerCase();
            if (venue.contains("conference") || venue.contains("proceedings") || venue.contains("symposium") || venue.contains("workshop")) {
                isConference = true;
            }
        }

        if (isConference) {
            com.drims.entity.Conference conference = new com.drims.entity.Conference();
            conference.setFacultyId(facultyId);
            conference.setTitle(dto.getTitle());
            conference.setYear(dto.getYear() != null && dto.getYear() > 0 ? dto.getYear() : java.time.LocalDate.now().getYear());
            conference.setDoi(dto.getDoi() != null ? dto.getDoi() : "-");
            conference.setAuthors(dto.getAuthors() != null ? dto.getAuthors() : new ArrayList<>());
            conference.setConferenceName(dto.getVenue() != null && !dto.getVenue().equals("N/A") ? dto.getVenue() : "Imported Conference");
            conference.setOrganizer(dto.getPublisher() != null ? dto.getPublisher() : "-");
            conference.setApprovalStatus("SUBMITTED");
            conference.setStatus("Published");
            conference.setCategory("International");
            if (dto.getAbstractText() != null && !dto.getAbstractText().isEmpty()) {
                conference.setRemarks("Abstract: " + dto.getAbstractText());
            }
            conference.setCitationCount(dto.getCitationCount());
            conferenceRepository.save(conference);
        } else {
            Journal journal = new Journal();
            journal.setFacultyId(facultyId);
            journal.setTitle(dto.getTitle());
            journal.setYear(dto.getYear() != null && dto.getYear() > 0 ? dto.getYear() : java.time.LocalDate.now().getYear());
            journal.setDoi(dto.getDoi() != null ? dto.getDoi() : "-");
            journal.setAuthors(dto.getAuthors() != null ? dto.getAuthors() : new ArrayList<>());
            journal.setJournalName(dto.getVenue() != null && !dto.getVenue().equals("N/A") ? dto.getVenue() : "Imported Journal");
            journal.setPublisher(dto.getPublisher() != null ? dto.getPublisher() : "-");
            journal.setApprovalStatus("SUBMITTED");
            journal.setStatus("Published");
            journal.setCategory("International");
            if (dto.getAbstractText() != null && !dto.getAbstractText().isEmpty()) {
                journal.setRemarks("Abstract: " + dto.getAbstractText());
            }
            journal.setCitationCount(dto.getCitationCount());
            journal.setQuartile(null); // Semantic Scholar doesn't provide this, but we preserve the field
            journalRepository.save(journal);
        }
        return true;
    }

    // --- ORCID Methods ---

    public List<ExternalPaperDTO> getOrcidWorks(String orcidId) {
        JsonNode response = orcidRestClient.get()
                .uri("/" + orcidId + "/works")
                .retrieve()
                .body(JsonNode.class);

        List<ExternalPaperDTO> works = new ArrayList<>();
        if (response != null && response.has("group")) {
            for (JsonNode group : response.get("group")) {
                JsonNode summary = group.get("work-summary").get(0);
                ExternalPaperDTO dto = new ExternalPaperDTO();
                dto.setTitle(summary.get("title").get("title").get("value").asText());
                dto.setYear(summary.path("publication-date").path("year").path("value").asInt(0));
                dto.setType(summary.path("type").asText(""));
                
                if (summary.has("external-ids") && summary.get("external-ids").has("external-id")) {
                    for (JsonNode id : summary.get("external-ids").get("external-id")) {
                        if ("doi".equalsIgnoreCase(id.get("external-id-type").asText())) {
                            dto.setDoi(id.get("external-id-value").asText());
                            break;
                        }
                    }
                }
                works.add(dto);
            }
        }
        return works;
    }

    public List<ExternalAuthorDTO> searchOrcidAuthors(String name) {
        JsonNode response = orcidRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/expanded-search")
                        .queryParam("q", name)
                        .build())
                .retrieve()
                .body(JsonNode.class);

        List<ExternalAuthorDTO> authors = new ArrayList<>();
        if (response != null && response.has("expanded-result")) {
            for (JsonNode node : response.get("expanded-result")) {
                ExternalAuthorDTO dto = new ExternalAuthorDTO();
                dto.setExternalId(node.path("orcid-id").asText());
                dto.setName(node.path("given-names").asText("") + " " + node.path("family-names").asText(""));
                dto.setSource("ORCID");
                authors.add(dto);
            }
        }
        return authors;
    }

    // --- Google Scholar (SerpApi) Methods ---

    public List<ExternalAuthorDTO> searchGoogleScholarAuthors(String name) {
        JsonNode response = serpApiRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search.json")
                        .queryParam("engine", "google_scholar_profiles")
                        .queryParam("mauthors", name)
                        .queryParam("api_key", serpApiKey)
                        .build())
                .retrieve()
                .body(JsonNode.class);

        List<ExternalAuthorDTO> authors = new ArrayList<>();
        if (response != null && response.has("profiles")) {
            for (JsonNode node : response.get("profiles")) {
                ExternalAuthorDTO dto = new ExternalAuthorDTO();
                dto.setExternalId(node.get("author_id").asText());
                dto.setName(node.get("name").asText());
                dto.setUrl(node.path("link").asText());
                dto.setHIndex(node.path("h_index").asInt(0)); // Note: Profiles search might not have h-index directly
                dto.setCitationCount(node.path("citations").asInt(0));
                dto.setSource("GoogleScholar");
                authors.add(dto);
            }
        }
        return authors;
    }

    public List<ExternalPaperDTO> getGoogleScholarPapers(String authorId) {
        JsonNode response = serpApiRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search.json")
                        .queryParam("engine", "google_scholar_author")
                        .queryParam("author_id", authorId)
                        .queryParam("api_key", serpApiKey)
                        .build())
                .retrieve()
                .body(JsonNode.class);

        List<ExternalPaperDTO> papers = new ArrayList<>();
        if (response != null && response.has("articles")) {
            for (JsonNode node : response.get("articles")) {
                ExternalPaperDTO dto = new ExternalPaperDTO();
                dto.setTitle(node.get("title").asText());
                dto.setVenue(node.path("publication").asText("N/A"));
                dto.setYear(extractYear(node.path("year").asText("0")));
                dto.setCitationCount(node.path("citations").path("total").asInt(0));
                
                String authorsStr = node.path("authors").asText("");
                if (!authorsStr.isEmpty()) {
                    dto.setAuthors(List.of(authorsStr.split(", ")));
                }
                
                dto.setSource("GoogleScholar");
                papers.add(dto);
            }
        }
        return papers;
    }

    private Integer extractYear(String yearStr) {
        try {
            return Integer.parseInt(yearStr.replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return java.time.LocalDate.now().getYear();
        }
    }
}
