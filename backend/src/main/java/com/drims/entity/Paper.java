package com.drims.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "papers")
public class Paper {
    @Id
    private String id; // Semantic Scholar Paper ID
    
    @Column(columnDefinition = "TEXT")
    private String title;
    
    @Column(name = "publication_year")
    private Integer year;
    
    private Integer citationCount;
    
    @Column(columnDefinition = "TEXT")
    private String journal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    @JsonIgnore
    private Author author;

    public Paper() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public Integer getCitationCount() { return citationCount; }
    public void setCitationCount(Integer citationCount) { this.citationCount = citationCount; }
    public String getJournal() { return journal; }
    public void setJournal(String journal) { this.journal = journal; }
    public Author getAuthor() { return author; }
    public void setAuthor(Author author) { this.author = author; }
}
