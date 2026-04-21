package com.drims.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class BookDTO {
    private String id;
    
    @NotBlank(message = "Book title is required")
    private String bookTitle;
    
    private List<String> authors;
    private List<String> correspondingAuthors;
    
    @NotBlank(message = "Publisher is required")
    private String publisher;
    
    @NotBlank(message = "ISBN is required")
    private String isbn;
    
    @NotNull(message = "Publication year is required")
    private Integer publicationYear;
    
    @NotBlank(message = "Role is required")
    private String role;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Status is required")
    private String status;
    
    @NotBlank(message = "DOI is required (Use - or nil if not available)")
    private String doi;
    
    @NotBlank(message = "Volume is required (Use - or nil if not available)")
    private String volume;
    
    private String impactFactor;
    
    private String journalHIndex;
    
    private String approvalStatus;
    private String remarks;
    
    @NotBlank(message = "Book cover is required")
    private String bookCoverPath;
    
    @NotBlank(message = "ISBN proof is required")
    private String isbnProofPath;

    public BookDTO() {}

    public BookDTO(String id, String bookTitle, List<String> authors, List<String> correspondingAuthors, String publisher, String isbn, Integer publicationYear, String role, String category, String status, String doi, String volume, String impactFactor, String journalHIndex, String approvalStatus, String remarks, String bookCoverPath, String isbnProofPath) {
        this.id = id;
        this.bookTitle = bookTitle;
        this.authors = authors;
        this.correspondingAuthors = correspondingAuthors;
        this.publisher = publisher;
        this.isbn = isbn;
        this.publicationYear = publicationYear;
        this.role = role;
        this.category = category;
        this.status = status;
        this.doi = doi;
        this.volume = volume;
        this.impactFactor = impactFactor;
        this.journalHIndex = journalHIndex;
        this.approvalStatus = approvalStatus;
        this.remarks = remarks;
        this.bookCoverPath = bookCoverPath;
        this.isbnProofPath = isbnProofPath;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }
    public List<String> getAuthors() { return authors; }
    public void setAuthors(List<String> authors) { this.authors = authors; }
    public List<String> getCorrespondingAuthors() { return correspondingAuthors; }
    public void setCorrespondingAuthors(List<String> correspondingAuthors) { this.correspondingAuthors = correspondingAuthors; }
    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public Integer getPublicationYear() { return publicationYear; }
    public void setPublicationYear(Integer publicationYear) { this.publicationYear = publicationYear; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDoi() { return doi; }
    public void setDoi(String doi) { this.doi = doi; }
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
    public String getBookCoverPath() { return bookCoverPath; }
    public void setBookCoverPath(String bookCoverPath) { this.bookCoverPath = bookCoverPath; }
    public String getIsbnProofPath() { return isbnProofPath; }
    public void setIsbnProofPath(String isbnProofPath) { this.isbnProofPath = isbnProofPath; }
}
