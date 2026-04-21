package com.drims.repository.mongo;

import com.drims.document.AuthorDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface AuthorMongoRepository extends MongoRepository<AuthorDocument, String> {
    Optional<AuthorDocument> findByOrcid(String orcid);
}
