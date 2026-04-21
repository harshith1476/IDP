package com.drims.controller;

import com.drims.entity.Author;
import com.drims.service.AuthorResearchService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/research")
@CrossOrigin(origins = "*")
public class AuthorResearchController {

    @Autowired
    private AuthorResearchService authorResearchService;

    @GetMapping("/authors/search")
    public ResponseEntity<List<Author>> searchAuthors(@RequestParam String name) {
        return ResponseEntity.ok(authorResearchService.searchAuthorsByName(name));
    }

    @GetMapping("/authors/{authorId}")
    public ResponseEntity<Author> getAuthorProfile(@PathVariable String authorId) {
        Author author = authorResearchService.getAuthorProfile(authorId);
        if (author != null) {
            return ResponseEntity.ok(author);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/papers/{paperId}")
    public ResponseEntity<JsonNode> getPaperDetails(@PathVariable String paperId) {
        JsonNode details = authorResearchService.getPaperDetails(paperId);
        if (details != null) {
            return ResponseEntity.ok(details);
        }
        return ResponseEntity.notFound().build();
    }
}
