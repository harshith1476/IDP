package com.drims.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    
    @Value("${file.upload.dir}")
    private String uploadDir;
    
    // Store file for faculty
    public String storeFile(MultipartFile file, String facultyId, String category) {
        return storeFileForUser(file, "faculty", facultyId, category);
    }
    
    // Store file for student
    public String storeFileForStudent(MultipartFile file, String studentId, String category) {
        return storeFileForUser(file, "student", studentId, category);
    }
    
    // Generic file storage method
    private String storeFileForUser(MultipartFile file, String userType, String userId, String category) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is empty or null");
        }
        
        // Validate file size (max 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds 10MB limit");
        }
        
        // Validate file type
        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();
        
        boolean isProfilePhoto = category != null && category.equalsIgnoreCase("profile-photo");
        
        if (isProfilePhoto) {
            // Allow common image formats for profile photos
            String lowerName = originalFilename != null ? originalFilename.toLowerCase() : "";
            boolean isImage = (contentType != null && (contentType.equals("image/jpeg") || contentType.equals("image/png")))
                    || lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg") || lowerName.endsWith(".png");
            
            if (!isImage) {
                throw new RuntimeException("Only JPG or PNG images are allowed for profile photo");
            }
        } else {
            // Default: allow only PDF (for publications and documents)
            boolean isPdf = (contentType != null && contentType.equals("application/pdf")) ||
                           (originalFilename != null && originalFilename.toLowerCase().endsWith(".pdf"));
            
            if (!isPdf) {
                throw new RuntimeException("Only PDF files are allowed");
            }
        }
        
        try {
            // Create directory structure: uploads/userType/userId/category
            Path uploadPath = Paths.get(uploadDir, userType, userId, category);
            Files.createDirectories(uploadPath);
            
            // Generate unique filename
            String defaultExtension = isProfilePhoto ? ".jpg" : ".pdf";
            String extension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                    : defaultExtension;
            String filename = UUID.randomUUID().toString() + extension;
            
            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Return relative path: userType/userId/category/filename
            return Paths.get(userType, userId, category, filename).toString().replace("\\", "/");
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }
    
    // Load file as Resource for downloading
    public Resource loadFileAsResource(String filePath) {
        try {
            Path file = Paths.get(uploadDir).resolve(filePath).normalize();
            Resource resource = new UrlResource(file.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found: " + filePath);
            }
        } catch (Exception e) {
            throw new RuntimeException("Could not read file: " + filePath, e);
        }
    }
    
    // Load file as Path (backward compatibility)
    public Path loadFile(String filePath) {
        return Paths.get(uploadDir).resolve(filePath).normalize();
    }
    
    // Delete file
    public boolean deleteFile(String filePath) {
        try {
            Path file = Paths.get(uploadDir).resolve(filePath).normalize();
            return Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + filePath, e);
        }
    }
}

