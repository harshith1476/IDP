package com.drims.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class FacultyProfileDTO {
    private String id;
    
    @NotBlank(message = "Employee ID is required")
    private String employeeId;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Designation is required")
    private String designation;
    
    @NotBlank(message = "Department is required")
    private String department;
    
    private String photoPath;
    private String description;
    private List<String> researchAreas;
    private String orcidId;
    private String scopusId;
    private String googleScholarLink;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    private Integer hIndex;
    private Integer citationCount;
    private String semanticScholarId;
    private String googleScholarId;
    
    // New Scholar tracking fields
    private String scholarId;
    private java.time.LocalDateTime scholarLastUpdated;
    private Boolean hasUpdate;

    public FacultyProfileDTO() {}

    public FacultyProfileDTO(String id, String employeeId, String name, String designation, String department, String photoPath, String description, List<String> researchAreas, String orcidId, String scopusId, String googleScholarLink, String email, Integer hIndex, Integer citationCount, String semanticScholarId) {
        this.id = id;
        this.employeeId = employeeId;
        this.name = name;
        this.designation = designation;
        this.department = department;
        this.photoPath = photoPath;
        this.description = description;
        this.researchAreas = researchAreas;
        this.orcidId = orcidId;
        this.scopusId = scopusId;
        this.googleScholarLink = googleScholarLink;
        this.email = email;
        this.hIndex = hIndex;
        this.citationCount = citationCount;
        this.semanticScholarId = semanticScholarId;
    }

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
    public String getPhotoPath() { return photoPath; }
    public void setPhotoPath(String photoPath) { this.photoPath = photoPath; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getResearchAreas() { return researchAreas; }
    public void setResearchAreas(List<String> researchAreas) { this.researchAreas = researchAreas; }
    public String getOrcidId() { return orcidId; }
    public void setOrcidId(String orcidId) { this.orcidId = orcidId; }
    public String getScopusId() { return scopusId; }
    public void setScopusId(String scopusId) { this.scopusId = scopusId; }
    public String getGoogleScholarLink() { return googleScholarLink; }
    public void setGoogleScholarLink(String googleScholarLink) { this.googleScholarLink = googleScholarLink; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getHIndex() { return hIndex; }
    public void setHIndex(Integer hIndex) { this.hIndex = hIndex; }
    public Integer getCitationCount() { return citationCount; }
    public void setCitationCount(Integer citationCount) { this.citationCount = citationCount; }
    public String getSemanticScholarId() { return semanticScholarId; }
    public void setSemanticScholarId(String semanticScholarId) { this.semanticScholarId = semanticScholarId; }
    public String getGoogleScholarId() { return googleScholarId; }
    public void setGoogleScholarId(String googleScholarId) { this.googleScholarId = googleScholarId; }

    public String getScholarId() { return scholarId; }
    public void setScholarId(String scholarId) { this.scholarId = scholarId; }
    public java.time.LocalDateTime getScholarLastUpdated() { return scholarLastUpdated; }
    public void setScholarLastUpdated(java.time.LocalDateTime scholarLastUpdated) { this.scholarLastUpdated = scholarLastUpdated; }
    public Boolean getHasUpdate() { return hasUpdate; }
    public void setHasUpdate(Boolean hasUpdate) { this.hasUpdate = hasUpdate; }
}
