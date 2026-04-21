package com.drims.dto;

import jakarta.validation.constraints.NotBlank;

public class ProjectDTO {
    private String id;
    
    @NotBlank(message = "Project type is required")
    private String projectType;
    
    private String seedGrantLink;
    
    @NotBlank(message = "Investigator name is required")
    private String investigatorName;
    
    @NotBlank(message = "Department is required")
    private String department;
    
    @NotBlank(message = "Employee ID is required")
    private String employeeId;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Date approved is required")
    private String dateApproved;
    
    @NotBlank(message = "Duration is required")
    private String duration;
    
    @NotBlank(message = "Amount is required")
    private String amount;
    
    @NotBlank(message = "Outcome proof is required")
    private String outcomeProofPath;
    
    @NotBlank(message = "Status is required")
    private String status;
    
    private String approvalStatus;
    private String remarks;

    public ProjectDTO() {}

    public ProjectDTO(String id, String projectType, String seedGrantLink, String investigatorName, String department, String employeeId, String title, String dateApproved, String duration, String amount, String outcomeProofPath, String status, String approvalStatus, String remarks) {
        this.id = id;
        this.projectType = projectType;
        this.seedGrantLink = seedGrantLink;
        this.investigatorName = investigatorName;
        this.department = department;
        this.employeeId = employeeId;
        this.title = title;
        this.dateApproved = dateApproved;
        this.duration = duration;
        this.amount = amount;
        this.outcomeProofPath = outcomeProofPath;
        this.status = status;
        this.approvalStatus = approvalStatus;
        this.remarks = remarks;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getProjectType() { return projectType; }
    public void setProjectType(String projectType) { this.projectType = projectType; }
    public String getSeedGrantLink() { return seedGrantLink; }
    public void setSeedGrantLink(String seedGrantLink) { this.seedGrantLink = seedGrantLink; }
    public String getInvestigatorName() { return investigatorName; }
    public void setInvestigatorName(String investigatorName) { this.investigatorName = investigatorName; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDateApproved() { return dateApproved; }
    public void setDateApproved(String dateApproved) { this.dateApproved = dateApproved; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }
    public String getOutcomeProofPath() { return outcomeProofPath; }
    public void setOutcomeProofPath(String outcomeProofPath) { this.outcomeProofPath = outcomeProofPath; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
