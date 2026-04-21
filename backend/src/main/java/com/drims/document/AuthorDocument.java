package com.drims.document;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document(collection = "authors")
public class AuthorDocument {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String orcid;
    
    private String name;
    private String affiliation;
    private String biography;
}
