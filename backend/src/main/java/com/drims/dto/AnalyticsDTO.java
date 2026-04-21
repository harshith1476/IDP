package com.drims.dto;

import java.util.Map;

public class AnalyticsDTO {
    private Map<Integer, Integer> yearWiseTotals;
    private Map<String, Integer> categoryWiseTotals;
    private Map<String, Integer> facultyWiseContribution;
    private Map<String, Integer> statusWiseBreakdown;

    public AnalyticsDTO() {}

    public AnalyticsDTO(Map<Integer, Integer> yearWiseTotals, Map<String, Integer> categoryWiseTotals, Map<String, Integer> facultyWiseContribution, Map<String, Integer> statusWiseBreakdown) {
        this.yearWiseTotals = yearWiseTotals;
        this.categoryWiseTotals = categoryWiseTotals;
        this.facultyWiseContribution = facultyWiseContribution;
        this.statusWiseBreakdown = statusWiseBreakdown;
    }

    public Map<Integer, Integer> getYearWiseTotals() { return yearWiseTotals; }
    public void setYearWiseTotals(Map<Integer, Integer> yearWiseTotals) { this.yearWiseTotals = yearWiseTotals; }
    public Map<String, Integer> getCategoryWiseTotals() { return categoryWiseTotals; }
    public void setCategoryWiseTotals(Map<String, Integer> categoryWiseTotals) { this.categoryWiseTotals = categoryWiseTotals; }
    public Map<String, Integer> getFacultyWiseContribution() { return facultyWiseContribution; }
    public void setFacultyWiseContribution(Map<String, Integer> facultyWiseContribution) { this.facultyWiseContribution = facultyWiseContribution; }
    public Map<String, Integer> getStatusWiseBreakdown() { return statusWiseBreakdown; }
    public void setStatusWiseBreakdown(Map<String, Integer> statusWiseBreakdown) { this.statusWiseBreakdown = statusWiseBreakdown; }
}
