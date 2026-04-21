package com.drims.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "book_chapters")
public class BookChapter {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String facultyId;
    
    private String title;
    private String bookTitle;
    
    @ElementCollection
    @CollectionTable(name = "book_chapter_authors", joinColumns = @JoinColumn(name = "chapter_id"))
    @Column(name = "author")
    private List<String> authors = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "book_chapter_corresponding_authors", joinColumns = @JoinColumn(name = "chapter_id"))
    @Column(name = "corresponding_author")
    private List<String> correspondingAuthors = new ArrayList<>();
    
    private String editors;
    private String publisher;
    @Column(name = "publication_year")
    private Integer year;
    private String pages;
    private String isbn;
    private String status;
    private String category;
    
    private String doi;
    private String volume;
    private String impactFactor;
    private String journalHIndex;
    
    private String approvalStatus;
    @Column(columnDefinition = "TEXT")
    private String remarks;
    private String approvedBy;
    private LocalDateTime approvedAt;
    
    private String chapterPdfPath;
    private String isbnProofPath;
    
    @Deprecated
    private String proofDocumentPath;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public BookChapter() {}

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
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
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
    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    public String getChapterPdfPath() { return chapterPdfPath; }
    public void setChapterPdfPath(String chapterPdfPath) { this.chapterPdfPath = chapterPdfPath; }
    public String getIsbnProofPath() { return isbnProofPath; }
    public void setIsbnProofPath(String isbnProofPath) { this.isbnProofPath = isbnProofPath; }
    public String getProofDocumentPath() { return proofDocumentPath; }
    public void setProofDocumentPath(String proofDocumentPath) { this.proofDocumentPath = proofDocumentPath; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
