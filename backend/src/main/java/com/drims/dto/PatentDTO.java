package com.drims.dto;

import com.drims.validation.ValidPatentFiles;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.util.List;

@ValidPatentFiles
public class PatentDTO {
    private String id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String patentNumber;
    
    private List<String> inventors;
    private List<String> correspondingInventors;
    
    @NotNull(message = "Year is required")
    @Min(value = 2000, message = "Year must be valid")
    private Integer year;
    
    private String country;
    
    @NotBlank(message = "Status is required")
    private String status;
    
    @NotBlank(message = "Category is required")
    private String category;
    private String applicationNumber;
    private String filingDate;
    
    @NotBlank(message = "DOI is required (Use - or nil if not available)")
    private String doi;
    
    @NotBlank(message = "Publisher is required (Use - or nil if not available)")
    private String publisher;
    
    @NotBlank(message = "Volume is required (Use - or nil if not available)")
    private String volume;
    
    private String impactFactor;
    
    private String journalHIndex;
    
    private String approvalStatus;
    private String remarks;
    
    private String filingProofPath;
    private String publicationCertificatePath;
    private String grantCertificatePath;
    private String proofDocumentPath;

    public PatentDTO() {}

    public PatentDTO(String id, String title, String patentNumber, List<String> inventors, List<String> correspondingInventors, Integer year, String country, String status, String category, String applicationNumber, String filingDate, String doi, String publisher, String volume, String impactFactor, String journalHIndex, String approvalStatus, String remarks, String filingProofPath, String publicationCertificatePath, String grantCertificatePath, String proofDocumentPath) {
        this.id = id;
        this.title = title;
        this.patentNumber = patentNumber;
        this.inventors = inventors;
        this.correspondingInventors = correspondingInventors;
        this.year = year;
        this.country = country;
        this.status = status;
        this.category = category;
        this.applicationNumber = applicationNumber;
        this.filingDate = filingDate;
        this.doi = doi;
        this.publisher = publisher;
        this.volume = volume;
        this.impactFactor = impactFactor;
        this.journalHIndex = journalHIndex;
        this.approvalStatus = approvalStatus;
        this.remarks = remarks;
        this.filingProofPath = filingProofPath;
        this.publicationCertificatePath = publicationCertificatePath;
        this.grantCertificatePath = grantCertificatePath;
        this.proofDocumentPath = proofDocumentPath;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
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
    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }
    public String getFilingDate() { return filingDate; }
    public void setFilingDate(String filingDate) { this.filingDate = filingDate; }
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
    public String getFilingProofPath() { return filingProofPath; }
    public void setFilingProofPath(String filingProofPath) { this.filingProofPath = filingProofPath; }
    public String getPublicationCertificatePath() { return publicationCertificatePath; }
    public void setPublicationCertificatePath(String publicationCertificatePath) { this.publicationCertificatePath = publicationCertificatePath; }
    public String getGrantCertificatePath() { return grantCertificatePath; }
    public void setGrantCertificatePath(String grantCertificatePath) { this.grantCertificatePath = grantCertificatePath; }
    public String getProofDocumentPath() { return proofDocumentPath; }
    public void setProofDocumentPath(String proofDocumentPath) { this.proofDocumentPath = proofDocumentPath; }
}
