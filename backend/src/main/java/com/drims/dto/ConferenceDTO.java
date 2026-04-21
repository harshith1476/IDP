package com.drims.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.util.List;

public class ConferenceDTO {
    private String id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Conference name is required")
    private String conferenceName;
    
    private List<String> authors;
    private List<String> correspondingAuthors;
    
    @NotNull(message = "Year is required")
    @Min(value = 2000, message = "Year must be valid")
    private Integer year;
    
    @NotBlank(message = "Location is required")
    private String location;
    private String date;
    
    @NotBlank(message = "Status is required")
    private String status;
    
    // New fields for uniformity across publications
    @NotBlank(message = "DOI is required (Use - or nil if not available)")
    private String doi;
    
    @NotBlank(message = "Publisher is required (Use - or nil if not available)")
    private String publisher;
    
    @NotBlank(message = "Volume is required (Use - or nil if not available)")
    private String volume;
    
    private String impactFactor;
    
    private String journalHIndex;
    
    // New fields for enhanced conference
    private String organizer;
    @NotBlank(message = "Category is required")
    private String category; // National or International
    @NotBlank(message = "Registration Amount is required")
    private String registrationAmount;
    @NotBlank(message = "Payment Mode is required")
    private String paymentMode; // Cash, Online, Cheque, etc.
    
    // Student participation fields (Legacy - kept for backward compatibility)
    private String studentName;
    private String studentRegisterNumber;
    private String guideId;
    private String guideName;
    
    // Student collaboration (for faculty publications)
    private Boolean collaboratedWithStudents;
    private List<StudentCollaborationDTO> studentCollaborations;
    
    // Approval workflow
    private String approvalStatus;
    private String remarks;
    
    // File uploads (mandatory)
    @NotBlank(message = "Payment details are required")
    private String paymentDetails;
    
    @NotBlank(message = "Registration receipt/payment proof is required")
    private String registrationReceiptPath;
    
    @NotBlank(message = "Acknowledgment/payment receipt mail proof is required")
    private String acknowledgmentPath;
    
    @NotBlank(message = "Certificate is required")
    private String certificatePath;
    
    @NotBlank(message = "Published paper is required")
    private String publishedPaperPath;
    
    private String proofDocumentPath; // Legacy field

    public ConferenceDTO() {}

    public ConferenceDTO(String id, String title, String conferenceName, List<String> authors, List<String> correspondingAuthors, Integer year, String location, String date, String status, String doi, String publisher, String volume, String impactFactor, String journalHIndex, String organizer, String category, String registrationAmount, String paymentMode, String studentName, String studentRegisterNumber, String guideId, String guideName, Boolean collaboratedWithStudents, List<StudentCollaborationDTO> studentCollaborations, String approvalStatus, String remarks, String paymentDetails, String registrationReceiptPath, String acknowledgmentPath, String certificatePath, String publishedPaperPath, String proofDocumentPath) {
        this.id = id;
        this.title = title;
        this.conferenceName = conferenceName;
        this.authors = authors;
        this.correspondingAuthors = correspondingAuthors;
        this.year = year;
        this.location = location;
        this.date = date;
        this.status = status;
        this.doi = doi;
        this.publisher = publisher;
        this.volume = volume;
        this.impactFactor = impactFactor;
        this.journalHIndex = journalHIndex;
        this.organizer = organizer;
        this.category = category;
        this.registrationAmount = registrationAmount;
        this.paymentMode = paymentMode;
        this.studentName = studentName;
        this.studentRegisterNumber = studentRegisterNumber;
        this.guideId = guideId;
        this.guideName = guideName;
        this.collaboratedWithStudents = collaboratedWithStudents;
        this.studentCollaborations = studentCollaborations;
        this.approvalStatus = approvalStatus;
        this.remarks = remarks;
        this.paymentDetails = paymentDetails;
        this.registrationReceiptPath = registrationReceiptPath;
        this.acknowledgmentPath = acknowledgmentPath;
        this.certificatePath = certificatePath;
        this.publishedPaperPath = publishedPaperPath;
        this.proofDocumentPath = proofDocumentPath;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getConferenceName() { return conferenceName; }
    public void setConferenceName(String conferenceName) { this.conferenceName = conferenceName; }
    public List<String> getAuthors() { return authors; }
    public void setAuthors(List<String> authors) { this.authors = authors; }
    public List<String> getCorrespondingAuthors() { return correspondingAuthors; }
    public void setCorrespondingAuthors(List<String> correspondingAuthors) { this.correspondingAuthors = correspondingAuthors; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDoi() { return doi; }
    public void setDoi(String doi) { this.doi = doi; }
    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }
    public String getVolume() { return volume; }
    public void setVolume(String volume) { this.volume = volume; }
    public String getImpactFactor() { return impactFactor; }
    public void setImpactFactor(String impactFactor) { this.impactFactor = impactFactor; }
    public String getJournalHIndex() { return journalHIndex; }
    public void setJournalHIndex(String journalHIndex) { this.journalHIndex = journalHIndex; }
    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getRegistrationAmount() { return registrationAmount; }
    public void setRegistrationAmount(String registrationAmount) { this.registrationAmount = registrationAmount; }
    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getStudentRegisterNumber() { return studentRegisterNumber; }
    public void setStudentRegisterNumber(String studentRegisterNumber) { this.studentRegisterNumber = studentRegisterNumber; }
    public String getGuideId() { return guideId; }
    public void setGuideId(String guideId) { this.guideId = guideId; }
    public String getGuideName() { return guideName; }
    public void setGuideName(String guideName) { this.guideName = guideName; }
    public Boolean getCollaboratedWithStudents() { return collaboratedWithStudents; }
    public void setCollaboratedWithStudents(Boolean collaboratedWithStudents) { this.collaboratedWithStudents = collaboratedWithStudents; }
    public List<StudentCollaborationDTO> getStudentCollaborations() { return studentCollaborations; }
    public void setStudentCollaborations(List<StudentCollaborationDTO> studentCollaborations) { this.studentCollaborations = studentCollaborations; }
    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getPaymentDetails() { return paymentDetails; }
    public void setPaymentDetails(String paymentDetails) { this.paymentDetails = paymentDetails; }
    public String getRegistrationReceiptPath() { return registrationReceiptPath; }
    public void setRegistrationReceiptPath(String registrationReceiptPath) { this.registrationReceiptPath = registrationReceiptPath; }
    public String getAcknowledgmentPath() { return acknowledgmentPath; }
    public void setAcknowledgmentPath(String acknowledgmentPath) { this.acknowledgmentPath = acknowledgmentPath; }
    public String getCertificatePath() { return certificatePath; }
    public void setCertificatePath(String certificatePath) { this.certificatePath = certificatePath; }
    public String getPublishedPaperPath() { return publishedPaperPath; }
    public void setPublishedPaperPath(String publishedPaperPath) { this.publishedPaperPath = publishedPaperPath; }
    public String getProofDocumentPath() { return proofDocumentPath; }
    public void setProofDocumentPath(String proofDocumentPath) { this.proofDocumentPath = proofDocumentPath; }
}
