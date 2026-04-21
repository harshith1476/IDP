package com.drims.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "faculty_profiles")
public class FacultyProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(unique = true)
    private String employeeId;
    
    private String name;
    private String designation;
    private String department;
    
    @ElementCollection
    @CollectionTable(name = "faculty_research_areas", joinColumns = @JoinColumn(name = "faculty_id"))
    @Column(name = "research_area")
    private List<String> researchAreas = new ArrayList<>();
    
    private String photoPath;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String orcidId;
    private String scopusId;
    private String googleScholarLink;
    
    @Column(unique = true)
    private String email;
    
    private String userId;
    
    private Integer hIndex;
    private Integer citationCount;
    private String semanticScholarId;
    private String googleScholarId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Google Scholar Tracking Fields
    @Column(name = "scholar_id")
    private String scholarId;
    
    @Column(name = "scholar_last_updated")
    private LocalDateTime scholarLastUpdated;
    
    @Column(name = "has_update")
    private Boolean hasUpdate = false;

    public FacultyProfile() {}

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
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public List<String> getResearchAreas() { return researchAreas; }
    public void setResearchAreas(List<String> researchAreas) { this.researchAreas = researchAreas; }
    public String getPhotoPath() { return photoPath; }
    public void setPhotoPath(String photoPath) { this.photoPath = photoPath; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getOrcidId() { return orcidId; }
    public void setOrcidId(String orcidId) { this.orcidId = orcidId; }
    public String getScopusId() { return scopusId; }
    public void setScopusId(String scopusId) { this.scopusId = scopusId; }
    public String getGoogleScholarLink() { return googleScholarLink; }
    public void setGoogleScholarLink(String googleScholarLink) { this.googleScholarLink = googleScholarLink; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Integer getHIndex() { return hIndex; }
    public void setHIndex(Integer hIndex) { this.hIndex = hIndex; }
    public Integer getCitationCount() { return citationCount; }
    public void setCitationCount(Integer citationCount) { this.citationCount = citationCount; }
    public String getSemanticScholarId() { return semanticScholarId; }
    public void setSemanticScholarId(String semanticScholarId) { this.semanticScholarId = semanticScholarId; }
    public String getGoogleScholarId() { return googleScholarId; }
    public void setGoogleScholarId(String googleScholarId) { this.googleScholarId = googleScholarId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getScholarId() { return scholarId; }
    public void setScholarId(String scholarId) { this.scholarId = scholarId; }
    public LocalDateTime getScholarLastUpdated() { return scholarLastUpdated; }
    public void setScholarLastUpdated(LocalDateTime scholarLastUpdated) { this.scholarLastUpdated = scholarLastUpdated; }
    public Boolean getHasUpdate() { return hasUpdate; }
    public void setHasUpdate(Boolean hasUpdate) { this.hasUpdate = hasUpdate; }
}
