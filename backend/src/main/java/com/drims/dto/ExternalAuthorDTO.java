package com.drims.dto;

import lombok.Data;

@Data
public class ExternalAuthorDTO {
    private String externalId;
    private String name;
    private String url;
    private Integer hIndex;
    private Integer citationCount;
    private Integer paperCount;
    private String orcid;
    private String source; // "SemanticScholar", "ORCID"
}
