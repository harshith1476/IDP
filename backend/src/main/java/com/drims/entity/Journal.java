package com.drims.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "journals")
public class Journal {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String facultyId;
    private String studentId;
    
    @Column(columnDefinition = "TEXT")
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String journalName;
    
    @ElementCollection
    @CollectionTable(name = "journal_authors", joinColumns = @JoinColumn(name = "journal_id"))
    @Column(name = "author")
    private List<String> authors = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "journal_corresponding_authors", joinColumns = @JoinColumn(name = "journal_id"))
    @Column(name = "corresponding_author")
    private List<String> correspondingAuthors = new ArrayList<>();
    
    @Column(name = "publication_year")
    private Integer year;
    private String volume;
    private String issue;
    private String pages;
    private String doi;
    private String impactFactor;
    private String journalHIndex;
    private String status;
    private String category;
    private String indexType;
    private String quartile;
    @Column(columnDefinition = "TEXT")
    private String publisher;
    private String issn;
    private String openAccess;
    private Integer citationCount;
    
    private String approvalStatus;
    @Column(columnDefinition = "TEXT")
    private String remarks;
    private String approvedBy;
    private LocalDateTime approvedAt;
    
    private Boolean collaboratedWithStudents;
    
    @ElementCollection
    @CollectionTable(name = "journal_student_collaborations", joinColumns = @JoinColumn(name = "journal_id"))
    private List<StudentCollaboration> studentCollaborations = new ArrayList<>();
    
    private String acceptanceMailPath;
    private String publishedPaperPath;
    private String indexProofPath;
    
    @Deprecated
    private String proofDocumentPath;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Journal() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Manual Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getFacultyId() { return facultyId; }
    public void setFacultyId(String facultyId) { this.facultyId = facultyId; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getJournalName() { return journalName; }
    public void setJournalName(String journalName) { this.journalName = journalName; }
    public List<String> getAuthors() { return authors; }
    public void setAuthors(List<String> authors) { this.authors = authors; }
    public List<String> getCorrespondingAuthors() { return correspondingAuthors; }
    public void setCorrespondingAuthors(List<String> correspondingAuthors) { this.correspondingAuthors = correspondingAuthors; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getVolume() { return volume; }
    public void setVolume(String volume) { this.volume = volume; }
    public String getIssue() { return issue; }
    public void setIssue(String issue) { this.issue = issue; }
    public String getPages() { return pages; }
    public void setPages(String pages) { this.pages = pages; }
    public String getDoi() { return doi; }
    public void setDoi(String doi) { this.doi = doi; }
    public String getImpactFactor() { return impactFactor; }
    public void setImpactFactor(String impactFactor) { this.impactFactor = impactFactor; }
    public String getJournalHIndex() { return journalHIndex; }
    public void setJournalHIndex(String journalHIndex) { this.journalHIndex = journalHIndex; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getIndexType() { return indexType; }
    public void setIndexType(String indexType) { this.indexType = indexType; }
    public String getQuartile() { return quartile; }
    public void setQuartile(String quartile) { this.quartile = quartile; }
    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }
    public String getIssn() { return issn; }
    public void setIssn(String issn) { this.issn = issn; }
    public String getOpenAccess() { return openAccess; }
    public void setOpenAccess(String openAccess) { this.openAccess = openAccess; }
    public Integer getCitationCount() { return citationCount; }
    public void setCitationCount(Integer citationCount) { this.citationCount = citationCount; }
    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    public Boolean getCollaboratedWithStudents() { return collaboratedWithStudents; }
    public void setCollaboratedWithStudents(Boolean collaboratedWithStudents) { this.collaboratedWithStudents = collaboratedWithStudents; }
    public List<StudentCollaboration> getStudentCollaborations() { return studentCollaborations; }
    public void setStudentCollaborations(List<StudentCollaboration> studentCollaborations) { this.studentCollaborations = studentCollaborations; }
    public String getAcceptanceMailPath() { return acceptanceMailPath; }
    public void setAcceptanceMailPath(String acceptanceMailPath) { this.acceptanceMailPath = acceptanceMailPath; }
    public String getPublishedPaperPath() { return publishedPaperPath; }
    public void setPublishedPaperPath(String publishedPaperPath) { this.publishedPaperPath = publishedPaperPath; }
    public String getIndexProofPath() { return indexProofPath; }
    public void setIndexProofPath(String indexProofPath) { this.indexProofPath = indexProofPath; }
    public String getProofDocumentPath() { return proofDocumentPath; }
    public void setProofDocumentPath(String proofDocumentPath) { this.proofDocumentPath = proofDocumentPath; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
