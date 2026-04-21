package com.drims.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patents")
public class Patent {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String facultyId;
    
    private String title;
    private String applicationNumber;
    private String filingDate;
    private String patentNumber;
    
    @ElementCollection
    @CollectionTable(name = "patent_inventors", joinColumns = @JoinColumn(name = "patent_id"))
    @Column(name = "inventor")
    private List<String> inventors = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "patent_corresponding_inventors", joinColumns = @JoinColumn(name = "patent_id"))
    @Column(name = "corresponding_inventor")
    private List<String> correspondingInventors = new ArrayList<>();
    
    @Column(name = "publication_year")
    private Integer year;
    private String country;
    private String status;
    private String category;
    
    private String doi;
    private String publisher;
    private String volume;
    private String impactFactor;
    private String journalHIndex;
    
    private String approvalStatus;
    @Column(columnDefinition = "TEXT")
    private String remarks;
    private String approvedBy;
    private LocalDateTime approvedAt;
    
    private String filingProofPath;
    private String publicationCertificatePath;
    private String grantCertificatePath;
    
    @Deprecated
    private String proofDocumentPath;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Patent() {}

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
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }
    public String getFilingDate() { return filingDate; }
    public void setFilingDate(String filingDate) { this.filingDate = filingDate; }
    public String getPatentNumber() { return patentNumber; }
    public void setPatentNumber(String patentNumber) { this.patentNumber = patentNumber; }
    public List<String> getInventors() { return inventors; }
    public void setInventors(List<String> inventors) { this.inventors = inventors; }
    public List<String> getCorrespondingInventors() { return correspondingInventors; }
    public void setCorrespondingInventors(List<String> correspondingInventors) { this.correspondingInventors = correspondingInventors; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDoi() { return doi; }
    public void setDoi(String doi) { this.doi = doi; }
    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }
    public String getVolume() { return volume; }
    public void setVolume(String volume) { this.volume = volume; }
    public String getImpactFactor() { return impactFactor; }
    public void setImpactFactor(String impactFactor) { this.impactFactor = impactFactor; }
    public String getJournalHIndex() { return journalHIndex; }
    public void setJournalHIndex(String journalHIndex) { this.journalHIndex = journalHIndex; }
    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    public String getFilingProofPath() { return filingProofPath; }
    public void setFilingProofPath(String filingProofPath) { this.filingProofPath = filingProofPath; }
    public String getPublicationCertificatePath() { return publicationCertificatePath; }
    public void setPublicationCertificatePath(String publicationCertificatePath) { this.publicationCertificatePath = publicationCertificatePath; }
    public String getGrantCertificatePath() { return grantCertificatePath; }
    public void setGrantCertificatePath(String grantCertificatePath) { this.grantCertificatePath = grantCertificatePath; }
    public String getProofDocumentPath() { return proofDocumentPath; }
    public void setProofDocumentPath(String proofDocumentPath) { this.proofDocumentPath = proofDocumentPath; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
