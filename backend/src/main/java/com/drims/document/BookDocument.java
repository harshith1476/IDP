package com.drims.document;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@Document(collection = "books")
public class BookDocument {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String externalId; // id from Google Books
    
    private String title;
    private List<String> authors;
    private String publisher;
    private String publishedDate;
    private String description;
    private String isbn;
}
