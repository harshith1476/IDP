package com.drims.dto;

public class StudentProfileDTO {
    private String id;
    private String registerNumber;
    private String name;
    private String department;
    private String program;
    private String year;
    private String guideId;
    private String guideName;

    public StudentProfileDTO() {
    }

    public StudentProfileDTO(String id, String registerNumber, String name, String department, String program,
            String year, String guideId, String guideName) {
        this.id = id;
        this.registerNumber = registerNumber;
        this.name = name;
        this.department = department;
        this.program = program;
        this.year = year;
        this.guideId = guideId;
        this.guideName = guideName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRegisterNumber() {
        return registerNumber;
    }

    public void setRegisterNumber(String registerNumber) {
        this.registerNumber = registerNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getGuideId() {
        return guideId;
    }

    public void setGuideId(String guideId) {
        this.guideId = guideId;
    }

    public String getGuideName() {
        return guideName;
    }

    public void setGuideName(String guideName) {
        this.guideName = guideName;
    }
}
