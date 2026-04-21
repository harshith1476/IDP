package com.drims.service;

import com.drims.entity.Author;
import com.drims.entity.Paper;
import com.drims.repository.AuthorRepository;
import com.drims.repository.PaperRepository;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class AuthorResearchService {

    @Autowired
    private WebClient semanticScholarWebClient;

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private PaperRepository paperRepository;

    public List<Author> searchAuthorsByName(String name) {
        log.info("Searching authors by name: {}", name);
        try {
            JsonNode response = semanticScholarWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/author/search")
                        .queryParam("query", name)
                        .queryParam("fields", "authorId,name,affiliations,hIndex,citationCount")
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

            List<Author> authors = new ArrayList<>();
            if (response != null && response.has("data")) {
                for (JsonNode node : response.get("data")) {
                    Author author = mapJsonToAuthor(node);
                    authors.add(author);
                }
            }
            return authors;
        } catch (Exception e) {
            log.error("Error searching authors by name: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Transactional
    public Author getAuthorProfile(String authorId) {
        log.info("Fetching profile for author ID: {}", authorId);
        
        // 1. Check DB first
        Optional<Author> existingAuthor = authorRepository.findById(authorId);
        if (existingAuthor.isPresent()) {
            Author cachedAuthor = existingAuthor.get();
            // If we have papers, return cached data to avoid API calls
            if (cachedAuthor.getPapers() != null && !cachedAuthor.getPapers().isEmpty()) {
                log.info("Returning cached author data for: {}", authorId);
                return cachedAuthor;
            }
        }

        // 2. Fetch from API if not in DB or no papers
        try {
            JsonNode node = semanticScholarWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/author/" + authorId)
                        .queryParam("fields", "authorId,name,affiliations,hIndex,citationCount,papers.paperId,papers.title,papers.year,papers.citationCount,papers.journal")
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

            if (node == null || node.isMissingNode()) {
                log.warn("No data returned for author {}", authorId);
                return existingAuthor.orElse(null);
            }

            Author author = existingAuthor.orElse(new Author());
            author.setId(node.path("authorId").asText(""));
            author.setName(node.path("name").asText("Unknown Author"));
            
            StringBuilder affiliations = new StringBuilder();
            if (node.has("affiliations")) {
                for (JsonNode aff : node.get("affiliations")) {
                    if (affiliations.length() > 0) affiliations.append("; ");
                    affiliations.append(aff.asText());
                }
            }
            author.setAffiliation(affiliations.toString());
            author.sethIndex(node.path("hIndex").asInt(0));
            author.setTotalCitations(node.path("citationCount").asInt(0));

            // Save author basics first
            Author savedAuthor = authorRepository.save(author);

            // Map and save papers if present
            if (node.has("papers")) {
                List<Paper> paperList = new ArrayList<>();
                for (JsonNode pNode : node.get("papers")) {
                    String paperId = pNode.path("paperId").asText(null);
                    if (paperId == null || paperId.isEmpty()) continue;
                    
                    Paper paper = paperRepository.findById(paperId).orElse(new Paper());
                    paper.setId(paperId);
                    paper.setTitle(pNode.path("title").asText("Untitled Publication"));
                    paper.setYear(pNode.path("year").asInt(0));
                    paper.setCitationCount(pNode.path("citationCount").asInt(0));
                    
                    JsonNode journalNode = pNode.path("journal");
                    if (!journalNode.isMissingNode() && !journalNode.isNull()) {
                        paper.setJournal(journalNode.path("name").asText(""));
                    }
                    
                    paper.setAuthor(savedAuthor);
                    paperList.add(paper);
                }
                
                if (!paperList.isEmpty()) {
                    paperRepository.saveAll(paperList);
                    savedAuthor.setPapers(paperList);
                }
            }
            
            return savedAuthor;
        } catch (WebClientResponseException e) {
            log.error("Semantic Scholar API Error ({}): {}", e.getStatusCode(), e.getResponseBodyAsString());
            return existingAuthor.orElse(null);
        } catch (Exception e) {
            log.error("Fatal error fetching author profile for {}: {}", authorId, e.getMessage());
            e.printStackTrace();
            return existingAuthor.orElse(null);
        }
    }

    public JsonNode getPaperDetails(String paperId) {
        log.info("Fetching details for paper ID: {}", paperId);
        try {
            return semanticScholarWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/paper/" + paperId)
                        .queryParam("fields", "title,year,citationCount,journal,authors,abstract,venue,externalIds")
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
        } catch (Exception e) {
            log.error("Error fetching paper details: {}", e.getMessage());
            return null;
        }
    }

    private Author mapJsonToAuthor(JsonNode node) {
        Author author = new Author();
        author.setId(node.path("authorId").asText(""));
        author.setName(node.path("name").asText("Unknown Author"));
        
        StringBuilder affiliations = new StringBuilder();
        if (node.has("affiliations")) {
            for (JsonNode aff : node.get("affiliations")) {
                if (affiliations.length() > 0) affiliations.append("; ");
                affiliations.append(aff.asText());
            }
        }
        author.setAffiliation(affiliations.toString());
        author.sethIndex(node.path("hIndex").asInt(0));
        author.setTotalCitations(node.path("citationCount").asInt(0));
        return author;
    }
}
