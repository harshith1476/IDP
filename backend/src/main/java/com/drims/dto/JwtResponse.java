package com.drims.dto;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String email;
    private String registerNumber;
    private String role;
    private String facultyId;
    private String studentId;

    public JwtResponse() {}

    public JwtResponse(String token, String type, String email, String registerNumber, String role, String facultyId, String studentId) {
        this.token = token;
        this.type = type;
        this.email = email;
        this.registerNumber = registerNumber;
        this.role = role;
        this.facultyId = facultyId;
        this.studentId = studentId;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getFacultyId() { return facultyId; }
    public void setFacultyId(String facultyId) { this.facultyId = facultyId; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
}
