package com.drims.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.util.List;

public class BookChapterDTO {
    private String id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Book title is required")
    private String bookTitle;
    
    private List<String> authors;
    private List<String> correspondingAuthors;
    
    private String editors;
    @NotBlank(message = "Publisher is required (Use - or nil if not available)")
    private String publisher;
    
    @NotNull(message = "Year is required")
    @Min(value = 2000, message = "Year must be valid")
    private Integer year;
    
    private String pages;
    
    @NotBlank(message = "ISBN is required (Use - or nil if not available)")
    private String isbn;
    
    @NotBlank(message = "DOI is required (Use - or nil if not available)")
    private String doi;
    
    @NotBlank(message = "Volume is required (Use - or nil if not available)")
    private String volume;
    
    private String impactFactor;
    
    private String journalHIndex;
    
    @NotBlank(message = "Status is required")
    private String status;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private String approvalStatus;
    private String remarks;
    
    @NotBlank(message = "Chapter PDF is required")
    private String chapterPdfPath;
    
    @NotBlank(message = "ISBN proof is required")
    private String isbnProofPath;
    
    private String proofDocumentPath;

    public BookChapterDTO() {}

    public BookChapterDTO(String id, String title, String bookTitle, List<String> authors, List<String> correspondingAuthors, String editors, String publisher, Integer year, String pages, String isbn, String doi, String volume, String impactFactor, String journalHIndex, String status, String category, String approvalStatus, String remarks, String chapterPdfPath, String isbnProofPath, String proofDocumentPath) {
        this.id = id;
        this.title = title;
        this.bookTitle = bookTitle;
        this.authors = authors;
        this.correspondingAuthors = correspondingAuthors;
        this.editors = editors;
        this.publisher = publisher;
        this.year = year;
        this.pages = pages;
        this.isbn = isbn;
        this.doi = doi;
        this.volume = volume;
        this.impactFactor = impactFactor;
        this.journalHIndex = journalHIndex;
        this.status = status;
        this.category = category;
        this.approvalStatus = approvalStatus;
        this.remarks = remarks;
        this.chapterPdfPath = chapterPdfPath;
        this.isbnProofPath = isbnProofPath;
        this.proofDocumentPath = proofDocumentPath;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }
    public List<String> getAuthors() { return authors; }
    public void setAuthors(List<String> authors) { this.authors = authors; }
    public List<String> getCorrespondingAuthors() { return correspondingAuthors; }
    public void setCorrespondingAuthors(List<String> correspondingAuthors) { this.correspondingAuthors = correspondingAuthors; }
    public String getEditors() { return editors; }
    public void setEditors(String editors) { this.editors = editors; }
    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getPages() { return pages; }
    public void setPages(String pages) { this.pages = pages; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public String getDoi() { return doi; }
    public void setDoi(String doi) { this.doi = doi; }
    public String getVolume() { return volume; }
    public void setVolume(String volume) { this.volume = volume; }
    public String getImpactFactor() { return impactFactor; }
    public void setImpactFactor(String impactFactor) { this.impactFactor = impactFactor; }
    public String getJournalHIndex() { return journalHIndex; }
    public void setJournalHIndex(String journalHIndex) { this.journalHIndex = journalHIndex; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getChapterPdfPath() { return chapterPdfPath; }
    public void setChapterPdfPath(String chapterPdfPath) { this.chapterPdfPath = chapterPdfPath; }
    public String getIsbnProofPath() { return isbnProofPath; }
    public void setIsbnProofPath(String isbnProofPath) { this.isbnProofPath = isbnProofPath; }
    public String getProofDocumentPath() { return proofDocumentPath; }
    public void setProofDocumentPath(String proofDocumentPath) { this.proofDocumentPath = proofDocumentPath; }
}
