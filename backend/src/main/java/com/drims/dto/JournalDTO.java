package com.drims.dto;

import com.drims.validation.ValidJournalFiles;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.util.List;

@ValidJournalFiles
public class JournalDTO {
    private String id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Journal name is required")
    private String journalName;
    
    private List<String> authors;
    private List<String> correspondingAuthors;
    
    @NotNull(message = "Year is required")
    @Min(value = 2000, message = "Year must be valid")
    private Integer year;
    
    @NotBlank(message = "Volume is required (Use - or nil if not available)")
    private String volume;
    
    private String issue;
    private String pages;
    
    @NotBlank(message = "DOI is required (Use - or nil if not available)")
    private String doi;
    
    @NotBlank(message = "Impact Factor is required (Use - or nil if not available)")
    private String impactFactor;
    
    @NotBlank(message = "h-index is required (Use - or nil if not available)")
    private String journalHIndex;
    
    private String status;
    
    @NotBlank(message = "Category is required")
    private String category;
    private String indexType;
    private String quartile;
    
    @NotBlank(message = "Publisher is required (Use - or nil if not available)")
    private String publisher;
    private String issn;
    private String openAccess;
    
    private String approvalStatus;
    private String remarks;
    
    private Boolean collaboratedWithStudents;
    private List<StudentCollaborationDTO> studentCollaborations;
    
    private String acceptanceMailPath;
    private String publishedPaperPath;
    
    @NotBlank(message = "Index proof is required")
    private String indexProofPath;
    
    private String proofDocumentPath;

    public JournalDTO() {}

    public JournalDTO(String id, String title, String journalName, List<String> authors, List<String> correspondingAuthors, Integer year, String volume, String issue, String pages, String doi, String impactFactor, String journalHIndex, String status, String category, String indexType, String quartile, String publisher, String issn, String openAccess, String approvalStatus, String remarks, Boolean collaboratedWithStudents, List<StudentCollaborationDTO> studentCollaborations, String acceptanceMailPath, String publishedPaperPath, String indexProofPath, String proofDocumentPath) {
        this.id = id;
        this.title = title;
        this.journalName = journalName;
        this.authors = authors;
        this.correspondingAuthors = correspondingAuthors;
        this.year = year;
        this.volume = volume;
        this.issue = issue;
        this.pages = pages;
        this.doi = doi;
        this.impactFactor = impactFactor;
        this.journalHIndex = journalHIndex;
        this.status = status;
        this.category = category;
        this.indexType = indexType;
        this.quartile = quartile;
        this.publisher = publisher;
        this.issn = issn;
        this.openAccess = openAccess;
        this.approvalStatus = approvalStatus;
        this.remarks = remarks;
        this.collaboratedWithStudents = collaboratedWithStudents;
        this.studentCollaborations = studentCollaborations;
        this.acceptanceMailPath = acceptanceMailPath;
        this.publishedPaperPath = publishedPaperPath;
        this.indexProofPath = indexProofPath;
        this.proofDocumentPath = proofDocumentPath;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
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
    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public Boolean getCollaboratedWithStudents() { return collaboratedWithStudents; }
    public void setCollaboratedWithStudents(Boolean collaboratedWithStudents) { this.collaboratedWithStudents = collaboratedWithStudents; }
    public List<StudentCollaborationDTO> getStudentCollaborations() { return studentCollaborations; }
    public void setStudentCollaborations(List<StudentCollaborationDTO> studentCollaborations) { this.studentCollaborations = studentCollaborations; }
    public String getAcceptanceMailPath() { return acceptanceMailPath; }
    public void setAcceptanceMailPath(String acceptanceMailPath) { this.acceptanceMailPath = acceptanceMailPath; }
    public String getPublishedPaperPath() { return publishedPaperPath; }
    public void setPublishedPaperPath(String publishedPaperPath) { this.publishedPaperPath = publishedPaperPath; }
    public String getIndexProofPath() { return indexProofPath; }
    public void setIndexProofPath(String indexProofPath) { this.indexProofPath = indexProofPath; }
    public String getProofDocumentPath() { return proofDocumentPath; }
    public void setProofDocumentPath(String proofDocumentPath) { this.proofDocumentPath = proofDocumentPath; }
}
