package com.drims.document;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document(collection = "patents")
public class PatentDocument {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String patentNumber;
    
    private String title;
    private String inventor;
    private String filingDate;
    private String status;
}
