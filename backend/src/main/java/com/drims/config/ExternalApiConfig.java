package com.drims.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class ExternalApiConfig {

    @Value("${orcid.client.id:}")
    private String orcidClientId;

    @Value("${orcid.client.secret:}")
    private String orcidClientSecret;

    @Value("${scholar.api.key:}")
    private String scholarApiKey;

    @Value("${serpapi.key:}")
    private String serpApiKey;

    @Value("${google.books.api.key:}")
    private String googleBooksApiKey;

    @Bean
    public RestClient semanticScholarRestClient() {
        RestClient.Builder builder = RestClient.builder()
                .baseUrl("https://api.semanticscholar.org/graph/v1");
        
        if (scholarApiKey != null && !scholarApiKey.isEmpty()) {
            builder.defaultHeader("x-api-key", scholarApiKey);
        }
        
        return builder.build();
    }

    @Bean
    public RestClient googleBooksRestClient() {
        return RestClient.builder()
                .baseUrl("https://www.googleapis.com/books/v1")
                .build();
    }

    @Bean
    public RestClient patentsViewRestClient() {
        return RestClient.builder()
                .baseUrl("https://search.patentsview.org/api/v1")
                .build();
    }

    @Bean
    public RestClient serpApiRestClient() {
        return RestClient.builder()
                .baseUrl("https://serpapi.com")
                .build();
    }

    @Bean
    public RestClient orcidRestClient() {
        return RestClient.builder()
                .baseUrl("https://pub.orcid.org/v3.0")
                .build();
    }

    @Bean
    public org.springframework.web.reactive.function.client.WebClient semanticScholarWebClient() {
        return org.springframework.web.reactive.function.client.WebClient.builder()
                .baseUrl("https://api.semanticscholar.org/graph/v1")
                .defaultHeader("x-api-key", scholarApiKey)
                .codecs(configurer -> configurer
                        .defaultCodecs()
                        .maxInMemorySize(10 * 1024 * 1024)) // 10MB buffer
                .build();
    }
}
