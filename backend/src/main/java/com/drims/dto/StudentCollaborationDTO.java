package com.drims.dto;

/**
 * DTO for student collaboration details in journals and conferences
 */
public class StudentCollaborationDTO {
    private String studentName;
    private String registrationNumber;
    private String year;
    private String guideName;

    public StudentCollaborationDTO() {}

    public StudentCollaborationDTO(String studentName, String registrationNumber, String year, String guideName) {
        this.studentName = studentName;
        this.registrationNumber = registrationNumber;
        this.year = year;
        this.guideName = guideName;
    }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    public String getGuideName() { return guideName; }
    public void setGuideName(String guideName) { this.guideName = guideName; }
}
