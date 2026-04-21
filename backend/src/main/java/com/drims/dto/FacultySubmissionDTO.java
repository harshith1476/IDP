package com.drims.dto;

public class FacultySubmissionDTO {
    private String id;
    private String employeeId;
    private String name;
    private String department;
    private int totalSubmissions;
    private int year;
    private String submissionStatus;

    public FacultySubmissionDTO() {}

    public FacultySubmissionDTO(String id, String employeeId, String name, String department, int totalSubmissions, int year, String submissionStatus) {
        this.id = id;
        this.employeeId = employeeId;
        this.name = name;
        this.department = department;
        this.totalSubmissions = totalSubmissions;
        this.year = year;
        this.submissionStatus = submissionStatus;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public int getTotalSubmissions() { return totalSubmissions; }
    public void setTotalSubmissions(int totalSubmissions) { this.totalSubmissions = totalSubmissions; }
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
    public String getSubmissionStatus() { return submissionStatus; }
    public void setSubmissionStatus(String submissionStatus) { this.submissionStatus = submissionStatus; }
}
