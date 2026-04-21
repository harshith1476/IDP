package com.drims.repository.mongo;

import com.drims.document.PatentDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PatentMongoRepository extends MongoRepository<PatentDocument, String> {
    Optional<PatentDocument> findByPatentNumber(String patentNumber);
}
