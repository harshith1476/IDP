package com.drims.controller;

import com.drims.document.AuthorDocument;
import com.drims.document.BookDocument;
import com.drims.document.PaperDocument;
import com.drims.document.PatentDocument;
import com.drims.service.ResearchSearchService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/research")
@CrossOrigin(origins = "*")
@Slf4j
public class ResearchSearchController {

    @Autowired
    private ResearchSearchService researchSearchService;

    @GetMapping("/search/papers")
    public ResponseEntity<List<PaperDocument>> searchPapers(@RequestParam String query) {
        log.info("API: search/papers for query={}", query);
        try {
            return ResponseEntity.ok(researchSearchService.searchPapers(query));
        } catch (Exception e) {
            log.error("Error searching papers: ", e);
            throw e;
        }
    }

    @GetMapping("/search/books")
    public ResponseEntity<List<BookDocument>> searchBooks(@RequestParam String query) {
        log.info("API: search/books for query={}", query);
        try {
            return ResponseEntity.ok(researchSearchService.searchBooks(query));
        } catch (Exception e) {
            log.error("Error searching books: ", e);
            throw e;
        }
    }

    @GetMapping("/search/patents")
    public ResponseEntity<List<PatentDocument>> searchPatents(@RequestParam String query) {
        log.info("API: search/patents for query={}", query);
        try {
            return ResponseEntity.ok(researchSearchService.searchPatents(query));
        } catch (Exception e) {
            log.error("Error searching patents: ", e);
            throw e;
        }
    }

    @GetMapping("/search/authors")
    public ResponseEntity<List<AuthorDocument>> searchAuthors(@RequestParam String name) {
        log.info("API: search/authors for name={}", name);
        try {
            return ResponseEntity.ok(researchSearchService.searchAuthors(name));
        } catch (Exception e) {
            log.error("Error searching authors: ", e);
            throw e;
        }
    }
}
