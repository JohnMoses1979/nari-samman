package com.example.nari.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

/**
 * Configuration for the Groq AI integration.
 *
 * All values are read from application.properties — nothing is hardcoded.
 * The {@link RestClient} bean is pre-configured with Groq's base URL and the
 * Authorization header so {@code AIService} only needs to set the body.
 *
 * Properties required in application.properties:
 *
 *   groq.api.key=gsk_...
 *   groq.api.url=https://api.groq.com/openai/v1
 *   groq.model=llama3-8b-8192
 *   groq.max-tokens=1024
 *   groq.temperature=0.7
 */
@Configuration
public class GroqConfig {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url:https://api.groq.com/openai/v1}")
    private String apiUrl;

    // ─── Accessors (used by AIService via @Value injection directly, but
    //     exposing them here allows future unit testing of the config bean) ────

    public String getApiKey() {
        return apiKey;
    }

    public String getApiUrl() {
        return apiUrl;
    }

    /**
     * A {@link RestClient} pre-configured for Groq's API.
     *
     * - baseUrl    : Groq's OpenAI-compatible endpoint root
     * - Authorization header : Bearer token set once here — AIService never
     *   handles the key directly, keeping it out of business logic.
     * - Content-Type / Accept : JSON by default via Spring's message converters
     *
     * RestClient is available from Spring Framework 6.1 (Spring Boot 3.2+).
     * Your project uses Spring Boot 3.5.14, so no new dependency is needed.
     */
    @Bean(name = "groqRestClient")
    public RestClient groqRestClient() {
        return RestClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }
}
