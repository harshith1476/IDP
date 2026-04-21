package com.drims.dto;

import lombok.Data;
import java.util.List;

@Data
public class ExternalPaperDTO {
    private String externalId;
    private String title;
    private String venue;
    private Integer year;
    private String doi;
    private List<String> authors;
    private String publisher;
    private String url;
    private String abstractText;
    private Integer citationCount;
    private String type; // journal-article, proceedings-article, etc.
    private String source;
}
