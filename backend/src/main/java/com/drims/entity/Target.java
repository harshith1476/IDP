package com.drims.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "targets", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"facultyId", "target_year"})
})
public class Target {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String facultyId;
    
    @Column(name = "target_year")
    private Integer year;
    private Integer journalTarget;
    private Integer conferenceTarget;
    private Integer patentTarget;
    private Integer bookChapterTarget;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Target() {}

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
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public Integer getJournalTarget() { return journalTarget; }
    public void setJournalTarget(Integer journalTarget) { this.journalTarget = journalTarget; }
    public Integer getConferenceTarget() { return conferenceTarget; }
    public void setConferenceTarget(Integer conferenceTarget) { this.conferenceTarget = conferenceTarget; }
    public Integer getPatentTarget() { return patentTarget; }
    public void setPatentTarget(Integer patentTarget) { this.patentTarget = patentTarget; }
    public Integer getBookChapterTarget() { return bookChapterTarget; }
    public void setBookChapterTarget(Integer bookChapterTarget) { this.bookChapterTarget = bookChapterTarget; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
