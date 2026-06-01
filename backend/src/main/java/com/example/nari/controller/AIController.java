package com.example.nari.controller;

import com.example.nari.dto.AiChatRequest;
import com.example.nari.dto.AudioTranscriptionRequest;
import com.example.nari.dto.AudioTranscriptionResponse;
import com.example.nari.dto.AiChatResponse;
import com.example.nari.service.AIService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * Consumer-facing AI assistant endpoint.
 *
 * POST /api/ai/chat — send a message (with conversation history) to Nari AI.
 *
 * This endpoint is intentionally open (no JWT required) so the AI assistant
 * works for both logged-in consumers and guests browsing the marketplace.
 * Rate-limiting should be applied at the API gateway / nginx level in production.
 *
 * The endpoint is registered in SecurityConfig under permitAll() — see the
 * comment in SecurityConfig for the exact path pattern to whitelist.
 */
@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    /**
     * POST /api/ai/chat
     *
     * Accepts a JSON body with the full conversation history so Groq can
     * generate a context-aware reply. The backend is stateless — the mobile
     * app owns and maintains the message history.
     *
     * Request body: {@link AiChatRequest}
     * Response:     {@link AiChatResponse}
     *
     * HTTP status codes:
     *  200 — AI replied successfully (success: true) OR a handled error
     *        occurred (success: false) — mobile app checks the "success" flag.
     *  400 — Validation failed (empty messages list, blank content, etc.)
     *  500 — Unhandled server error (should not occur; AIService catches all)
     */
    @PostMapping("/chat")
    public ResponseEntity<?> chat(@Valid @RequestBody AiChatRequest request) {
        try {
            AiChatResponse response = aiService.chat(request);

            // AIService always returns a response object (never null) — it
            // handles all Groq errors internally and sets success=false.
            // We return 200 in both cases so the mobile app parses the body
            // and shows the error message in the chat UI gracefully.
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Safety net — AIService.chat() should never throw, but if it
            // does, return a structured error consistent with other controllers.
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "success", false,
                            "message", "AI service is temporarily unavailable."
                    ));
        }
    }

    /**
     * POST /api/ai/transcribe
     *
     * Accepts an audio file and returns the transcribed text so the mobile
     * voice flow can reuse the same chat engine as typed messages.
     */
    @PostMapping(value = "/transcribe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> transcribe(@RequestPart("audio") MultipartFile audio) {
        try {
            String text = aiService.transcribe(audio);
            return ResponseEntity.ok(AudioTranscriptionResponse.ok(text));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(AudioTranscriptionResponse.fail(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(AudioTranscriptionResponse.fail(e.getMessage()));
        }
    }

    @PostMapping(value = "/transcribe-base64", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> transcribeBase64(@RequestBody AudioTranscriptionRequest request) {
        try {
            String text = aiService.transcribeBase64(
                    request.getAudioBase64(),
                    request.getFileName(),
                    request.getMimeType()
            );
            return ResponseEntity.ok(AudioTranscriptionResponse.ok(text));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(AudioTranscriptionResponse.fail(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(AudioTranscriptionResponse.fail(e.getMessage()));
        }
    }
}
