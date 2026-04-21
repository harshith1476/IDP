package com.drims.controller;

import com.drims.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    // Download/serve a file
    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(@RequestParam String path) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(path);

            // Determine content type based on file extension
            String lowerPath = path.toLowerCase();
            String contentType;
            if (lowerPath.endsWith(".pdf")) {
                contentType = "application/pdf";
            } else if (lowerPath.endsWith(".png")) {
                contentType = "image/png";
            } else if (lowerPath.endsWith(".jpg") || lowerPath.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else {
                contentType = "application/octet-stream";
            }
            String filename = path.contains("/") ? path.substring(path.lastIndexOf("/") + 1) : path;

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + URLEncoder.encode(filename, StandardCharsets.UTF_8.toString())
                                    + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Generic file upload endpoint (can be used by faculty or student)
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userType") String userType, // "faculty" or "student"
            @RequestParam("userId") String userId,
            @RequestParam("category") String category) {
        try {
            String filePath;
            if ("student".equalsIgnoreCase(userType)) {
                filePath = fileStorageService.storeFileForStudent(file, userId, category);
            } else {
                filePath = fileStorageService.storeFile(file, userId, category);
            }
            return ResponseEntity.ok(filePath);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("File upload failed: " + e.getMessage());
        }
    }
}
