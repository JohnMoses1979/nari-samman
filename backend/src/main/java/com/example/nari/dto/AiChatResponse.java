package com.example.nari.dto;

/**
 * Response returned by POST /api/ai/chat.
 *
 * The mobile app reads "reply" to display the AI message in the chat bubble.
 * "model" lets the frontend show which model answered (useful for debugging).
 *
 * Example response:
 * {
 *   "success": true,
 *   "reply": "Here are some honey products from our artisans...",
 *   "model": "llama3-8b-8192"
 * }
 */
public class AiChatResponse {

    private boolean success;
    private String reply;
    private String model;
    private String error;

    // ─── Factory helpers ──────────────────────────────────────────────────────

    public static AiChatResponse ok(String reply, String model) {
        AiChatResponse r = new AiChatResponse();
        r.success = true;
        r.reply   = reply;
        r.model   = model;
        return r;
    }

    public static AiChatResponse fail(String errorMessage) {
        AiChatResponse r = new AiChatResponse();
        r.success = false;
        r.reply   = errorMessage;
        r.error   = errorMessage;
        return r;
    }

    // ─── Getters & Setters ────────────────────────────────────────────────────

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
