package com.drims.repository.mongo;

import com.drims.document.PaperDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PaperMongoRepository extends MongoRepository<PaperDocument, String> {
    Optional<PaperDocument> findByExternalId(String externalId);
}
