package com.drims.dto;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public class PendingApprovalDTO {
    private String id;
    private String publicationType;
    private String title;
    private String facultyId;
    private String facultyName;
    private String studentId;
    private String studentName;
    private String approvalStatus;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
    private Map<String, String> filePaths = new HashMap<>();
    private Map<String, Object> publicationDetails = new HashMap<>();

    public PendingApprovalDTO() {}

    public PendingApprovalDTO(String id, String publicationType, String title, String facultyId, String facultyName, String studentId, String studentName, String approvalStatus, LocalDateTime submittedAt, LocalDateTime updatedAt, Map<String, String> filePaths, Map<String, Object> publicationDetails) {
        this.id = id;
        this.publicationType = publicationType;
        this.title = title;
        this.facultyId = facultyId;
        this.facultyName = facultyName;
        this.studentId = studentId;
        this.studentName = studentName;
        this.approvalStatus = approvalStatus;
        this.submittedAt = submittedAt;
        this.updatedAt = updatedAt;
        this.filePaths = filePaths;
        this.publicationDetails = publicationDetails;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPublicationType() { return publicationType; }
    public void setPublicationType(String publicationType) { this.publicationType = publicationType; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getFacultyId() { return facultyId; }
    public void setFacultyId(String facultyId) { this.facultyId = facultyId; }
    public String getFacultyName() { return facultyName; }
    public void setFacultyName(String facultyName) { this.facultyName = facultyName; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public Map<String, String> getFilePaths() { return filePaths; }
    public void setFilePaths(Map<String, String> filePaths) { this.filePaths = filePaths; }
    public Map<String, Object> getPublicationDetails() { return publicationDetails; }
    public void setPublicationDetails(Map<String, Object> publicationDetails) { this.publicationDetails = publicationDetails; }
}
