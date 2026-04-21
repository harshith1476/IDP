package com.drims.service;

import com.drims.document.AuthorDocument;
import com.drims.document.BookDocument;
import com.drims.document.PaperDocument;
import com.drims.document.PatentDocument;
import com.drims.repository.mongo.AuthorMongoRepository;
import com.drims.repository.mongo.BookMongoRepository;
import com.drims.repository.mongo.PaperMongoRepository;
import com.drims.repository.mongo.PatentMongoRepository;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@Slf4j
public class ResearchSearchService {

    @Autowired
    @Qualifier("semanticScholarRestClient")
    private RestClient scholarRestClient;

    @Autowired
    @Qualifier("googleBooksRestClient")
    private RestClient googleBooksRestClient;

    @Autowired
    @Qualifier("patentsViewRestClient")
    private RestClient patentsViewRestClient;

    @Autowired
    @Qualifier("orcidRestClient")
    private RestClient orcidRestClient;

    @Value("${google.books.api.key:}")
    private String googleBooksApiKey;

    @Autowired
    private PaperMongoRepository paperRepository;

    @Autowired
    private BookMongoRepository bookRepository;

    @Autowired
    private PatentMongoRepository patentRepository;

    @Autowired
    private AuthorMongoRepository authorRepository;

    // --- Papers (Semantic Scholar) ---
    public List<PaperDocument> searchPapers(String query) {
        log.info("Searching papers for query: {}", query);
        JsonNode response = scholarRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/paper/search")
                        .queryParam("query", query)
                        .queryParam("fields", "paperId,title,authors,abstract,year,citationCount,venue,externalIds")
                        .build())
                .retrieve()
                .body(JsonNode.class);

        List<PaperDocument> papers = new ArrayList<>();
        if (response != null && response.has("data")) {
            for (JsonNode node : response.get("data")) {
                String externalId = node.get("paperId").asText();
                
                // Cache check
                PaperDocument doc = paperRepository.findByExternalId(externalId)
                        .orElseGet(() -> {
                            List<String> authors = new ArrayList<>();
                            if (node.has("authors")) {
                                for (JsonNode a : node.get("authors")) {
                                    authors.add(a.get("name").asText());
                                }
                            }
                            PaperDocument newDoc = PaperDocument.builder()
                                    .externalId(externalId)
                                    .title(node.get("title").asText())
                                    .authors(authors)
                                    .abstractText(node.path("abstract").asText(""))
                                    .year(node.path("year").asInt(0))
                                    .citationCount(node.path("citationCount").asInt(0))
                                    .venue(node.path("venue").asText(""))
                                    .build();
                            return paperRepository.save(newDoc);
                        });
                papers.add(doc);
            }
        }
        return papers;
    }

    // --- Books (Google Books) ---
    public List<BookDocument> searchBooks(String query) {
        log.info("Searching books for query: {}", query);
        JsonNode response = googleBooksRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/volumes")
                        .queryParam("q", query)
                        .queryParam("key", googleBooksApiKey)
                        .build())
                .retrieve()
                .body(JsonNode.class);

        List<BookDocument> books = new ArrayList<>();
        if (response != null && response.has("items")) {
            for (JsonNode node : response.get("items")) {
                String externalId = node.get("id").asText();
                JsonNode info = node.get("volumeInfo");
                
                BookDocument doc = bookRepository.findByExternalId(externalId)
                        .orElseGet(() -> {
                            List<String> authors = new ArrayList<>();
                            if (info.has("authors")) {
                                for (JsonNode a : info.get("authors")) {
                                    authors.add(a.asText());
                                }
                            }
                            BookDocument newDoc = BookDocument.builder()
                                    .externalId(externalId)
                                    .title(info.get("title").asText())
                                    .authors(authors)
                                    .publisher(info.path("publisher").asText("N/A"))
                                    .publishedDate(info.path("publishedDate").asText("N/A"))
                                    .description(info.path("description").asText(""))
                                    .build();
                            return bookRepository.save(newDoc);
                        });
                books.add(doc);
            }
        }
        return books;
    }

    // --- Patents (PatentsView) ---
    public List<PatentDocument> searchPatents(String query) {
        log.info("Searching patents for query: {}", query);
        // Note: PatentsView API v1 requires a JSON body for complex search, but we'll use a simple q param if supported or a default query
        // For the sake of this example, we'll fetch recently published patents matching a keyword
        JsonNode response = patentsViewRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/patent/search")
                        .queryParam("q", "{\"patent_title\":\"" + query + "\"}")
                        .queryParam("f", "[\"patent_number\",\"patent_title\",\"patent_date\"]")
                        .build())
                .retrieve()
                .body(JsonNode.class);

        List<PatentDocument> patents = new ArrayList<>();
        if (response != null && response.has("patents")) {
            for (JsonNode node : response.get("patents")) {
                String pNum = node.get("patent_number").asText();
                PatentDocument doc = patentRepository.findByPatentNumber(pNum)
                        .orElseGet(() -> {
                            PatentDocument newDoc = PatentDocument.builder()
                                    .patentNumber(pNum)
                                    .title(node.get("patent_title").asText())
                                    .filingDate(node.path("patent_date").asText("N/A"))
                                    .build();
                            return patentRepository.save(newDoc);
                        });
                patents.add(doc);
            }
        }
        return patents;
    }

    // --- Authors (ORCID) ---
    public List<AuthorDocument> searchAuthors(String name) {
        log.info("Searching authors for name: {}", name);
        JsonNode response = orcidRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("q", name)
                        .build())
                .retrieve()
                .body(JsonNode.class);

        List<AuthorDocument> authors = new ArrayList<>();
        if (response != null && response.has("result")) {
            for (JsonNode node : response.get("result")) {
                String orcid = node.get("orcid-identifier").get("path").asText();
                
                AuthorDocument doc = authorRepository.findByOrcid(orcid)
                        .orElseGet(() -> {
                            // Fetch full details if not in cache
                            JsonNode details = orcidRestClient.get()
                                    .uri("/" + orcid + "/person")
                                    .retrieve()
                                    .body(JsonNode.class);
                            
                            String fullName = details.path("name").path("given-names").path("value").asText("") + " " +
                                              details.path("name").path("family-name").path("value").asText("");
                            
                            AuthorDocument newDoc = AuthorDocument.builder()
                                    .orcid(orcid)
                                    .name(fullName.trim())
                                    .build();
                            return authorRepository.save(newDoc);
                        });
                authors.add(doc);
            }
        }
        return authors;
    }
}
