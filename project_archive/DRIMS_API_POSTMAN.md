# DRIMS Research Postman Collection - Example Calls

### 1. Search Papers (Semantic Scholar)
**Endpoint:** `GET /api/research/search/papers`
**Params:** 
- `query`: "Deep Learning"
**Description:** Fetches papers, maps fields (title, authors, citationCount), and caches in MongoDB.

---

### 2. Search Books (Google Books)
**Endpoint:** `GET /api/research/search/books`
**Params:**
- `query`: "Clean Code"
**Description:** Fetches books from Google Books using the provided API key.

---

### 3. Search Patents (PatentsView)
**Endpoint:** `GET /api/research/search/patents`
**Params:**
- `query`: "AI in health"
**Description:** Searches patents by title.

---

### 4. Search Authors (ORCID)
**Endpoint:** `GET /api/research/search/authors`
**Params:**
- `name`: "Robert C. Martin"
**Description:** Searches ORCID profiles and fetches the name and ORCID ID.

---

### Project Structure (MongoDB Module)
```
com.drims
├── controller
│   └── ResearchSearchController.java
├── service
│   └── ResearchSearchService.java
├── document
│   ├── PaperDocument.java
│   ├── BookDocument.java
│   ├── PatentDocument.java
│   └── AuthorDocument.java
└── repository.mongo
    ├── PaperMongoRepository.java
    ├── BookMongoRepository.java
    ├── PatentMongoRepository.java
    └── AuthorMongoRepository.java
```
