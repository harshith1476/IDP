package com.drims.document;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@Document(collection = "papers")
public class PaperDocument {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String externalId; // paperId from Semantic Scholar
    
    private String title;
    private List<String> authors;
    private String abstractText;
    private Integer year;
    private Integer citationCount;
    private String doi;
    private String venue;
}
