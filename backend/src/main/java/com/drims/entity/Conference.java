package com.drims.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conference {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String facultyId; // Reference to FacultyProfile, null for student publications
    private String studentId; // Reference to StudentProfile, null for faculty publications
    
    @Column(columnDefinition = "TEXT")
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String conferenceName;
    private String organizer;
    
    @ElementCollection
    @CollectionTable(name = "conference_authors", joinColumns = @JoinColumn(name = "conference_id"))
    @Column(name = "author")
    private List<String> authors = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "conference_corresponding_authors", joinColumns = @JoinColumn(name = "conference_id"))
    @Column(name = "corresponding_author")
    private List<String> correspondingAuthors = new ArrayList<>();
    
    @Column(name = "publication_year")
    private Integer year;
    private String location;
    private String date;
    private String status; // Communicated, Rejected, Accepted, Online Published, Published
    private String publishedIn; // Proceedings, IEEE, Springer, Others
    private String otherPublishedIn; // Custom text if Others selected
    private String category; // National or International
    private String registrationAmount;
    private String paymentMode; // Cash, Online, Cheque, etc.
    
    // New fields for uniformity across publications
    private String doi;
    private String publisher;
    private String volume;
    private String impactFactor;
    private String journalHIndex;
    private Integer citationCount;
    
    // Student participation fields (optional) - Legacy fields kept for backward compatibility
    private Boolean isStudentPublication; // true if student publication
    private String studentName; // Student name if student publication
    private String studentRegisterNumber; // Student register number
    private String guideId; // Reference to FacultyProfile (guide/supervisor)
    private String guideName; // Name of the guide
    
    // Student collaboration (for faculty publications)
    private Boolean collaboratedWithStudents; // Yes/No
    
    @ElementCollection
    @CollectionTable(name = "conference_student_collaborations", joinColumns = @JoinColumn(name = "conference_id"))
    private List<StudentCollaboration> studentCollaborations = new ArrayList<>();
    
    // Approval workflow
    private String approvalStatus; // SUBMITTED, APPROVED, REJECTED, SENT_BACK, LOCKED
    @Column(columnDefinition = "TEXT")
    private String remarks; // Admin remarks on rejection/send back
    private String approvedBy; // Admin user ID who approved
    private LocalDateTime approvedAt; // Approval timestamp
    
    // File uploads (mandatory)
    private String paymentDetails; // Transaction ID or Net Banking details
    private String registrationReceiptPath; // Registration or Payment Proof PDF
    private String acknowledgmentPath; // Payment Receipt Mail Proof (Acknowledgment Screenshot PDF)
    private String certificatePath; // PDF file path
    private String publishedPaperPath; // Published paper PDF
    
    // Legacy field for backward compatibility (deprecated, use specific fields above)
    @Deprecated
    private String proofDocumentPath; // PDF file path - kept for backward compatibility
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

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
    public String getFacultyId() { return facultyId; }
    public void setFacultyId(String facultyId) { this.facultyId = facultyId; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getConferenceName() { return conferenceName; }
    public void setConferenceName(String conferenceName) { this.conferenceName = conferenceName; }
    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }
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
    public String getPublishedIn() { return publishedIn; }
    public void setPublishedIn(String publishedIn) { this.publishedIn = publishedIn; }
    public String getOtherPublishedIn() { return otherPublishedIn; }
    public void setOtherPublishedIn(String otherPublishedIn) { this.otherPublishedIn = otherPublishedIn; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getRegistrationAmount() { return registrationAmount; }
    public void setRegistrationAmount(String registrationAmount) { this.registrationAmount = registrationAmount; }
    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }
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
    public Integer getCitationCount() { return citationCount; }
    public void setCitationCount(Integer citationCount) { this.citationCount = citationCount; }
    public Boolean getIsStudentPublication() { return isStudentPublication; }
    public void setIsStudentPublication(Boolean isStudentPublication) { this.isStudentPublication = isStudentPublication; }
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
    public List<StudentCollaboration> getStudentCollaborations() { return studentCollaborations; }
    public void setStudentCollaborations(List<StudentCollaboration> studentCollaborations) { this.studentCollaborations = studentCollaborations; }
    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

