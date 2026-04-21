package com.drims.repository.mongo;

import com.drims.document.BookDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface BookMongoRepository extends MongoRepository<BookDocument, String> {
    Optional<BookDocument> findByExternalId(String externalId);
}
