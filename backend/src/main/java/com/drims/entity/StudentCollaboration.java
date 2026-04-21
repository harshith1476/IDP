package com.drims.entity;

import jakarta.persistence.Embeddable;

/**
 * Embedded class for student collaboration details in journals and conferences
 */
@Embeddable
public class StudentCollaboration {
    private String studentName;
    private String registrationNumber;
    @jakarta.persistence.Column(name = "academic_year")
    private String academicYear;
    private String guideName;

    public StudentCollaboration() {}

    public StudentCollaboration(String studentName, String registrationNumber, String academicYear, String guideName) {
        this.studentName = studentName;
        this.registrationNumber = registrationNumber;
        this.academicYear = academicYear;
        this.guideName = guideName;
    }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public String getGuideName() { return guideName; }
    public void setGuideName(String guideName) { this.guideName = guideName; }
}
