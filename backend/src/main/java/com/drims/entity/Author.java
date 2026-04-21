package com.drims.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "authors")
public class Author {
    @Id
    private String id; // Semantic Scholar Author ID
    
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String affiliation;
    
    private Integer hIndex;
    private Integer totalCitations;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Paper> papers = new ArrayList<>();

    public Author() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAffiliation() { return affiliation; }
    public void setAffiliation(String affiliation) { this.affiliation = affiliation; }
    public Integer gethIndex() { return hIndex; }
    public void sethIndex(Integer hIndex) { this.hIndex = hIndex; }
    public Integer getTotalCitations() { return totalCitations; }
    public void setTotalCitations(Integer totalCitations) { this.totalCitations = totalCitations; }
    public List<Paper> getPapers() { return papers; }
    public void setPapers(List<Paper> papers) { this.papers = papers; }
}
