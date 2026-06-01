package com.example.nari.dto;

/**
 * Response returned by POST /api/ai/transcribe.
 */
public class AudioTranscriptionResponse {

    private boolean success;
    private String text;
    private String error;

    public static AudioTranscriptionResponse ok(String text) {
        AudioTranscriptionResponse response = new AudioTranscriptionResponse();
        response.success = true;
        response.text = text;
        return response;
    }

    public static AudioTranscriptionResponse fail(String error) {
        AudioTranscriptionResponse response = new AudioTranscriptionResponse();
        response.success = false;
        response.error = error;
        return response;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
