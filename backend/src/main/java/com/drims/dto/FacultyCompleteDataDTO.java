package com.drims.dto;

import java.util.List;

public class FacultyCompleteDataDTO {
    private FacultyProfileDTO profile;
    private List<TargetDTO> targets;
    private List<JournalDTO> journals;
    private List<ConferenceDTO> conferences;
    private List<PatentDTO> patents;
    private List<BookChapterDTO> bookChapters;
    private List<BookDTO> books;
    private List<ProjectDTO> projects;

    public FacultyCompleteDataDTO() {}

    public FacultyProfileDTO getProfile() { return profile; }
    public void setProfile(FacultyProfileDTO profile) { this.profile = profile; }
    public List<TargetDTO> getTargets() { return targets; }
    public void setTargets(List<TargetDTO> targets) { this.targets = targets; }
    public List<JournalDTO> getJournals() { return journals; }
    public void setJournals(List<JournalDTO> journals) { this.journals = journals; }
    public List<ConferenceDTO> getConferences() { return conferences; }
    public void setConferences(List<ConferenceDTO> conferences) { this.conferences = conferences; }
    public List<PatentDTO> getPatents() { return patents; }
    public void setPatents(List<PatentDTO> patents) { this.patents = patents; }
    public List<BookChapterDTO> getBookChapters() { return bookChapters; }
    public void setBookChapters(List<BookChapterDTO> bookChapters) { this.bookChapters = bookChapters; }
    public List<BookDTO> getBooks() { return books; }
    public void setBooks(List<BookDTO> books) { this.books = books; }
    public List<ProjectDTO> getProjects() { return projects; }
    public void setProjects(List<ProjectDTO> projects) { this.projects = projects; }
}
