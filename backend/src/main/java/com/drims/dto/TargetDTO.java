package com.drims.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class TargetDTO {
    private String id;
    
    @NotNull(message = "Year is required")
    @Min(value = 2000, message = "Year must be valid")
    private Integer year;
    
    @NotNull(message = "Journal target is required")
    @Min(value = 0, message = "Target must be non-negative")
    private Integer journalTarget;
    
    @NotNull(message = "Conference target is required")
    @Min(value = 0, message = "Target must be non-negative")
    private Integer conferenceTarget;
    
    @NotNull(message = "Patent target is required")
    @Min(value = 0, message = "Target must be non-negative")
    private Integer patentTarget;
    
    @NotNull(message = "Book chapter target is required")
    @Min(value = 0, message = "Target must be non-negative")
    private Integer bookChapterTarget;

    public TargetDTO() {}

    public TargetDTO(String id, Integer year, Integer journalTarget, Integer conferenceTarget, Integer patentTarget, Integer bookChapterTarget) {
        this.id = id;
        this.year = year;
        this.journalTarget = journalTarget;
        this.conferenceTarget = conferenceTarget;
        this.patentTarget = patentTarget;
        this.bookChapterTarget = bookChapterTarget;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public Integer getJournalTarget() { return journalTarget; }
    public void setJournalTarget(Integer journalTarget) { this.journalTarget = journalTarget; }
    public Integer getConferenceTarget() { return conferenceTarget; }
    public void setConferenceTarget(Integer conferenceTarget) { this.conferenceTarget = conferenceTarget; }
    public Integer getPatentTarget() { return patentTarget; }
    public void setPatentTarget(Integer patentTarget) { this.patentTarget = patentTarget; }
    public Integer getBookChapterTarget() { return bookChapterTarget; }
    public void setBookChapterTarget(Integer bookChapterTarget) { this.bookChapterTarget = bookChapterTarget; }
}
