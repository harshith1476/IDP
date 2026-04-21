package com.drims.dto;

import java.util.Map;

public class ResearchMetricsDTO {
    private Integer citationsAll;
    private Integer citationsSince2021;
    private Integer hIndexAll;
    private Integer i10IndexAll;
    private Map<Integer, Integer> citationsByYear;
    private Map<String, Integer> journalRankings;

    public ResearchMetricsDTO() {}

    // Getters and Setters
    public Integer getCitationsAll() { return citationsAll; }
    public void setCitationsAll(Integer citationsAll) { this.citationsAll = citationsAll; }
    public Integer getCitationsSince2021() { return citationsSince2021; }
    public void setCitationsSince2021(Integer citationsSince2021) { this.citationsSince2021 = citationsSince2021; }
    public Integer gethIndexAll() { return hIndexAll; }
    public void sethIndexAll(Integer hIndexAll) { this.hIndexAll = hIndexAll; }
    public Integer getI10IndexAll() { return i10IndexAll; }
    public void setI10IndexAll(Integer i10IndexAll) { this.i10IndexAll = i10IndexAll; }
    public Map<Integer, Integer> getCitationsByYear() { return citationsByYear; }
    public void setCitationsByYear(Map<Integer, Integer> citationsByYear) { this.citationsByYear = citationsByYear; }
    public Map<String, Integer> getJournalRankings() { return journalRankings; }
    public void setJournalRankings(Map<String, Integer> journalRankings) { this.journalRankings = journalRankings; }
}
