package com.example.nari.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Internal DTOs for the Groq Chat Completions API.
 *
 * These are NOT exposed to the mobile app — they are used only inside
 * AIService to serialize the outgoing request and deserialize Groq's response.
 *
 * Groq's API is OpenAI-compatible:
 *   POST https://api.groq.com/openai/v1/chat/completions
 *
 * All classes are package-private inner classes to keep the Groq wire format
 * isolated from the rest of the codebase. If Groq's API changes, only this
 * file needs updating.
 */
public class GroqApiDto {

    // ─── Outgoing request to Groq ─────────────────────────────────────────────

    /**
     * Top-level request body sent to Groq's chat completions endpoint.
     */
    public static class GroqRequest {

        private String model;
        private List<GroqMessage> messages;

        @JsonProperty("max_tokens")
        private int maxTokens;

        private double temperature;

        public GroqRequest(String model, List<GroqMessage> messages, int maxTokens, double temperature) {
            this.model       = model;
            this.messages    = messages;
            this.maxTokens   = maxTokens;
            this.temperature = temperature;
        }

        public String getModel() { return model; }
        public List<GroqMessage> getMessages() { return messages; }
        public int getMaxTokens() { return maxTokens; }
        public double getTemperature() { return temperature; }
    }

    /**
     * A single message in the Groq request — role + content.
     * Used for both the system prompt and conversation history.
     */
    public static class GroqMessage {

        private String role;
        private String content;

        public GroqMessage(String role, String content) {
            this.role    = role;
            this.content = content;
        }

        public String getRole() { return role; }
        public String getContent() { return content; }
    }

    // ─── Incoming response from Groq ──────────────────────────────────────────

    /**
     * Top-level response from Groq.
     * {@code @JsonIgnoreProperties(ignoreUnknown = true)} ensures forward
     * compatibility if Groq adds new fields.
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GroqResponse {

        private String id;
        private String model;
        private List<GroqChoice> choices;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }

        public List<GroqChoice> getChoices() { return choices; }
        public void setChoices(List<GroqChoice> choices) { this.choices = choices; }
    }

    /**
     * One completion choice returned by Groq.
     * Groq returns an array; we always use choices[0].
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GroqChoice {

        private GroqMessageContent message;

        @JsonProperty("finish_reason")
        private String finishReason;

        public GroqMessageContent getMessage() { return message; }
        public void setMessage(GroqMessageContent message) { this.message = message; }

        public String getFinishReason() { return finishReason; }
        public void setFinishReason(String finishReason) { this.finishReason = finishReason; }
    }

    /**
     * The actual message object inside a choice.
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GroqMessageContent {

        private String role;
        private String content;

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    /**
     * Response returned by Groq's speech-to-text endpoint.
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GroqTranscriptionResponse {
        private String text;

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }
}
