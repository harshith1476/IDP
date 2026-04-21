package com.drims.dto;

public class ApprovalActionDTO {
    private String action;
    private String remarks;
    private String publicationType;
    private String publicationId;

    public ApprovalActionDTO() {}

    public ApprovalActionDTO(String action, String remarks, String publicationType, String publicationId) {
        this.action = action;
        this.remarks = remarks;
        this.publicationType = publicationType;
        this.publicationId = publicationId;
    }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getPublicationType() { return publicationType; }
    public void setPublicationType(String publicationType) { this.publicationType = publicationType; }
    public String getPublicationId() { return publicationId; }
    public void setPublicationId(String publicationId) { this.publicationId = publicationId; }
}
