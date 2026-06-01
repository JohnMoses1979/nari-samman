package com.example.nari.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Map;
import java.util.List;

/**
 * Request body sent by the mobile app to POST /api/ai/chat.
 *
 * The mobile app sends the full conversation history so Groq has context
 * for multi-turn dialogue. This keeps the backend stateless — no session
 * or database storage is needed for Phase 1.
 *
 * Example payload:
 * {
 *   "conversationId": "nari-ai-123",
 *   "currentScreen": "AI Assistant",
 *   "responseMode": "conversational",
 *   "context": {
 *     "user": { "name": "Umesh" }
 *   },
 *   "messages": [
 *     { "role": "user", "content": "Show me honey products" }
 *   ]
 * }
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AiChatRequest {

    private String conversationId;
    private String currentScreen;
    private String responseMode;
    private Map<String, Object> context;

    @NotNull(message = "messages list is required")
    @NotEmpty(message = "messages list must not be empty")
    @Valid
    private List<MessageDto> messages;

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public String getCurrentScreen() {
        return currentScreen;
    }

    public void setCurrentScreen(String currentScreen) {
        this.currentScreen = currentScreen;
    }

    public String getResponseMode() {
        return responseMode;
    }

    public void setResponseMode(String responseMode) {
        this.responseMode = responseMode;
    }

    public Map<String, Object> getContext() {
        return context;
    }

    public void setContext(Map<String, Object> context) {
        this.context = context;
    }

    // ─── Getters & Setters ────────────────────────────────────────────────────

    public List<MessageDto> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageDto> messages) {
        this.messages = messages;
    }

    // ─── Nested DTO ───────────────────────────────────────────────────────────

    /**
     * A single message turn — mirrors the OpenAI / Groq message format exactly.
     * role must be "user" or "assistant".
     */
    public static class MessageDto {

        @NotBlank(message = "role is required")
        private String role;

        @NotBlank(message = "content is required")
        @Size(max = 4000, message = "message content must not exceed 4000 characters")
        private String content;

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}
