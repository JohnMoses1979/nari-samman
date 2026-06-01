package com.example.nari.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import com.example.nari.dto.AiChatRequest;
import com.example.nari.dto.AiChatResponse;
import com.example.nari.dto.GroqApiDto;

@Service
public class AIService {

    private static final Logger log = LoggerFactory.getLogger(AIService.class);
    private static final String CHAT_COMPLETIONS_PATH = "/chat/completions";
    private static final String TRANSCRIPTION_PATH = "/audio/transcriptions";

    @Value("${groq.model:llama3-8b-8192}")
    private String model;

    @Value("${groq.max-tokens:1024}")
    private int maxTokens;

    @Value("${groq.temperature:0.7}")
    private double temperature;

    @Value("${groq.transcription-model:whisper-large-v3-turbo}")
    private String transcriptionModel;

    private final RestClient groqRestClient;

    public AIService(@Qualifier("groqRestClient") RestClient groqRestClient) {
        this.groqRestClient = groqRestClient;
    }

    public String transcribe(MultipartFile audioFile) {
        if (audioFile == null || audioFile.isEmpty()) {
            throw new IllegalArgumentException("Audio file is required for transcription.");
        }

        try {
            return transcribeBytes(audioFile.getBytes(), audioFile.getOriginalFilename(), audioFile.getContentType());
        } catch (HttpClientErrorException e) {
            String message = buildTranscriptionErrorMessage(e.getResponseBodyAsString(), e.getMessage());
            log.error("Groq transcription client error [{}]: {}", e.getStatusCode(), message);
            throw new IllegalStateException(message, e);
        } catch (HttpServerErrorException e) {
            String message = buildTranscriptionErrorMessage(e.getResponseBodyAsString(), e.getMessage());
            log.error("Groq transcription server error [{}]: {}", e.getStatusCode(), message);
            throw new IllegalStateException(message, e);
        } catch (Exception e) {
            log.error("Groq transcription failed: {}", e.getMessage(), e);
            throw new IllegalStateException("Could not transcribe voice input right now. Please try again.", e);
        }
    }

    public String transcribeBase64(String audioBase64, String fileName, String mimeType) {
        if (audioBase64 == null || audioBase64.isBlank()) {
            throw new IllegalArgumentException("Audio content is required for transcription.");
        }

        try {
            String normalized = audioBase64
                    .replace("data:audio/m4a;base64,", "")
                    .replace("data:audio/mp4;base64,", "")
                    .replace("data:audio/3gpp;base64,", "")
                    .replace("data:audio/webm;base64,", "")
                    .replaceAll("\\s+", "");
            byte[] bytes = Base64.getDecoder().decode(normalized);
            return transcribeBytes(bytes, fileName, mimeType);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (HttpClientErrorException e) {
            String message = buildTranscriptionErrorMessage(e.getResponseBodyAsString(), e.getMessage());
            log.error("Groq base64 transcription client error [{}]: {}", e.getStatusCode(), message);
            throw new IllegalStateException(message, e);
        } catch (HttpServerErrorException e) {
            String message = buildTranscriptionErrorMessage(e.getResponseBodyAsString(), e.getMessage());
            log.error("Groq base64 transcription server error [{}]: {}", e.getStatusCode(), message);
            throw new IllegalStateException(message, e);
        } catch (Exception e) {
            log.error("Groq base64 transcription failed: {}", e.getMessage(), e);
            throw new IllegalStateException("Could not transcribe voice input right now. Please try again.", e);
        }
    }

    private String buildTranscriptionErrorMessage(String responseBody, String fallback) {
        if (responseBody != null && !responseBody.isBlank()) {
            return "Groq transcription failed: " + responseBody;
        }
        return fallback != null && !fallback.isBlank()
                ? "Groq transcription failed: " + fallback
                : "Could not transcribe voice input right now. Please try again.";
    }

    // AFTER:
    private String transcribeBytes(byte[] bytes, String filename, String contentType) throws IOException {
        final String safeFilename = (filename == null || filename.isBlank())
                ? "voice-message.m4a"
                : filename;

        final String safeMime = (contentType != null && !contentType.isBlank())
                ? contentType
                : "application/octet-stream";

        // Use LinkedMultiValueMap — handled entirely by FormHttpMessageConverter
        // (servlet stack, zero reactive-streams dependency required).
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        body.add("file", new ByteArrayResource(bytes) {
            @Override
            public String getFilename() {
                return safeFilename;
            }
        });
        body.add("model", transcriptionModel);
        body.add("response_format", "json");
        body.add("language", "en");

        GroqApiDto.GroqTranscriptionResponse response = groqRestClient
                .post()
                .uri(TRANSCRIPTION_PATH)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(GroqApiDto.GroqTranscriptionResponse.class);

        if (response == null || response.getText() == null || response.getText().isBlank()) {
            throw new IllegalStateException("Groq returned an empty transcription.");
        }

        return response.getText().trim();
    }

    public AiChatResponse chat(AiChatRequest request) {
        String queryText = getLatestUserMessage(request);
        String localReply = buildLocalAppReply(request, queryText);
        if (localReply != null) {
            return AiChatResponse.ok(localReply, "local-app-guide");
        }

        try {
            List<GroqApiDto.GroqMessage> groqMessages = buildGroqMessages(request);
            GroqApiDto.GroqRequest groqRequest = new GroqApiDto.GroqRequest(
                    model,
                    groqMessages,
                    maxTokens,
                    temperature
            );

            GroqApiDto.GroqResponse groqResponse = groqRestClient
                    .post()
                    .uri(CHAT_COMPLETIONS_PATH)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(groqRequest)
                    .retrieve()
                    .body(GroqApiDto.GroqResponse.class);

            String reply = extractReply(groqResponse);
            return AiChatResponse.ok(reply, model);
        } catch (HttpClientErrorException e) {
            log.error(
                    "Groq client error [{}] for conversationId={}, screen={}, query='{}': {}",
                    e.getStatusCode(),
                    request != null ? request.getConversationId() : null,
                    request != null ? request.getCurrentScreen() : null,
                    queryText,
                    e.getResponseBodyAsString()
            );
            return AiChatResponse.ok(buildGracefulFallbackReply(request, queryText), "local-fallback");
        } catch (HttpServerErrorException e) {
            log.error(
                    "Groq server error [{}] for conversationId={}, screen={}, query='{}': {}",
                    e.getStatusCode(),
                    request != null ? request.getConversationId() : null,
                    request != null ? request.getCurrentScreen() : null,
                    queryText,
                    e.getMessage()
            );
            return AiChatResponse.ok(buildGracefulFallbackReply(request, queryText), "local-fallback");
        } catch (ResourceAccessException e) {
            log.error(
                    "Network error reaching Groq for conversationId={}, screen={}, query='{}': {}",
                    request != null ? request.getConversationId() : null,
                    request != null ? request.getCurrentScreen() : null,
                    queryText,
                    e.getMessage()
            );
            return AiChatResponse.ok(buildGracefulFallbackReply(request, queryText), "local-fallback");
        } catch (Exception e) {
            log.error(
                    "Unexpected error in AIService.chat() for conversationId={}, screen={}, query='{}': {}",
                    request != null ? request.getConversationId() : null,
                    request != null ? request.getCurrentScreen() : null,
                    queryText,
                    e.getMessage(),
                    e
            );
            return AiChatResponse.ok(buildGracefulFallbackReply(request, queryText), "local-fallback");
        }
    }

    private AiChatResponse fallbackOrError(AiChatRequest request, String queryText, String message) {
        String fallback = buildLocalAppReply(request, queryText);
        if (fallback != null) {
            return AiChatResponse.ok(fallback, "local-app-guide");
        }
        return AiChatResponse.fail(message);
    }

    private String getLatestUserMessage(AiChatRequest request) {
        if (request == null || request.getMessages() == null) {
            return "";
        }

        for (int i = request.getMessages().size() - 1; i >= 0; i--) {
            AiChatRequest.MessageDto msg = request.getMessages().get(i);
            if (msg != null && "user".equalsIgnoreCase(msg.getRole())) {
                return String.valueOf(msg.getContent() == null ? "" : msg.getContent()).trim();
            }
        }
        return "";
    }

    private boolean containsAny(String text, String... needles) {
        String normalized = text == null ? "" : text.toLowerCase(Locale.ROOT);
        for (String needle : needles) {
            if (needle != null && normalized.contains(needle.toLowerCase(Locale.ROOT))) {
                return true;
            }
        }
        return false;
    }

    private String buildLocalAppReply(AiChatRequest request, String queryText) {
        String q = queryText == null ? "" : queryText.toLowerCase(Locale.ROOT);
        Map<String, Object> ctx = request != null ? request.getContext() : null;

        if (q.isBlank()) {
            return null;
        }

        if (isGreetingQuery(q)) {
            String name = extractString(ctx, "user", "name");
            return (name != null ? "Hello " + name + "!\n" : "Hello!\n")
                    + "Welcome to Nari Samman.\n"
                    + "I can guide you through the app step by step.\n"
                    + "Ask me about orders, products, addresses, login, profile, wishlist, notifications, vendors, or SHGs.";
        }

        if (isPasswordHelpQuery(q)) {
            return """
                    To reset your password in Nari Samman, you have two possible paths:

                    If you are on the login screen:
                    1. Open the Consumer Login screen.
                    2. Stay on the "Sign In" tab.
                    3. Tap "Forgot Password?" below the password field.
                    4. Enter your registered mobile number.
                    5. Tap "Send OTP" and verify the OTP.
                    6. Enter your new password and confirm it.
                    7. Tap "Save Password".

                    If you are already logged in:
                    1. Open the Profile screen.
                    2. Tap "Reset Password".
                    3. You will be taken to the same password recovery flow.
                    """.trim();
        }

        if (isRegisterHelpQuery(q)) {
            return """
                    To create a consumer account in Nari Samman:
                    1. Open the Consumer Login screen.
                    2. Tap the "Register" tab.
                    3. Enter your Full Name, Email Address, and Mobile Number.
                    4. Tap "Send OTP" and verify the OTP sent to your phone.
                    5. Create a password and confirm it.
                    6. Tap the register button to finish and enter the app.
                    """.trim();
        }

        if (isLoginHelpQuery(q)) {
            return """
                    To sign in:
                    1. Open the Consumer Login screen.
                    2. Make sure the "Sign In" tab is selected.
                    3. Enter your email address and password.
                    4. Tap the sign-in button.

                    If you forgot your password, use "Forgot Password?" on the same screen.
                    """.trim();
        }

        if (isPlaceOrderHelpQuery(q)) {
            return """
                    To place an order in Nari Samman:
                    1. Open a product from Explore or search results.
                    2. On the product details screen, tap "Add to Cart" if you want to buy later, or tap "Buy Now" to go directly to checkout.
                    3. If you used Add to Cart, open the Cart screen and tap "Checkout →".
                    4. On the Checkout screen, review the Delivery Address section carefully.
                    5. If needed, add or update the address before continuing.
                    6. Select your payment option.
                    7. Tap "Place Order 🎉" or "Pay Now" to complete the purchase.

                    If you want, I can also explain the order flow step by step from the product page to payment.
                    """.trim();
        }

        if (isAddressHelpQuery(q)) {
            return """
                    To edit or add an address in Nari Samman:
                    1. Open the Profile screen.
                    2. Tap "Saved Addresses".
                    3. To add a new one, tap "Add New Address".
                    4. Enter your name, phone number, address details, city, state, and pincode.
                    5. Tap "Save Address".
                    6. To modify an existing address, open that address and tap "Update" after making changes.

                    During checkout, the app also shows the Delivery Address section so you can confirm the delivery location before placing the order.
                    """.trim();
        }

        if (containsAny(q, "my name", "profile name", "who am i", "tell me my name")) {
            String name = extractString(ctx, "user", "name");
            if (name == null) {
                name = extractString(ctx, "profile", "name");
            }
            if (name == null) {
                name = "your profile name";
            }
            return "Your profile name is " + name + ". To edit it, go to Profile, tap Edit, update the Full Name field, and save the changes.";
        }

        if (isOrderStatusHelpQuery(q)) {
            return """
                    To check your orders in Nari Samman:
                    1. Open the Profile screen.
                    2. Tap "My Orders".
                    3. Open the most recent order card to see the item details, status, and tracking progress.
                    4. If the order has shipped, the order card will usually show the latest delivery stage.

                    If you want, I can also help you understand what each order status means.
                    """.trim();
        }

        if (containsAny(q, "wishlist", "saved items", "saved products")) {
            return """
                    To view your wishlist:
                    1. Open Profile.
                    2. Tap "Wishlist".
                    3. You will see all saved products there.
                    4. From there you can open a product, move it to cart, or remove it.
                    """.trim();
        }

        if (containsAny(q, "notification", "alerts")) {
            return """
                    To view notifications:
                    1. Open Profile.
                    2. Tap "Notifications".
                    3. You will see alerts about orders, updates, and app activity.
                    """.trim();
        }

        if (containsAny(q, "help & support", "help and support", "support", "help")) {
            return """
                    To get help inside the app:
                    1. Open Profile.
                    2. Tap "Help & Support".
                    3. You can use that section for app-related support and guidance.
                    """.trim();
        }

        if (containsAny(q, "payment methods", "upi", "card", "payment")) {
            return """
                    To manage payment methods:
                    1. Open Profile.
                    2. Tap "Payment Methods".
                    3. Review or update the available payment options from there.
                    """.trim();
        }

        if (containsAny(q, "impact stories", "impact story")) {
            return """
                    To view impact stories:
                    1. Open Profile.
                    2. Tap "Impact Stories".
                    3. You will see how your purchases support artisans and SHGs.
                    """.trim();
        }

        if (containsAny(q, "terms", "privacy")) {
            return """
                    To read the policies:
                    1. Open Profile.
                    2. Tap "Terms & Privacy".
                    3. Review the policy details shown there.
                    """.trim();
        }

        if (containsAny(q, "place order", "checkout", "add to cart", "buy now", "cart")) {
            return """
                    Here is the order flow in Nari Samman:
                    1. Open a product page from Explore or Search.
                    2. Tap "Add to Cart" or "Buy Now".
                    3. If you added it to the cart, open the Cart screen and tap "Checkout →".
                    4. Confirm the Delivery Address.
                    5. Choose your payment method.
                    6. Tap "Place Order 🎉" or "Pay Now" to finish.
                    """.trim();
        }

        if (containsAny(q, "what can you do", "how can you help", "help me", "what can you help with")) {
            return """
                    I can help you understand how to use Nari Samman step by step.
                    For example, I can explain how to:
                    - sign in or register
                    - reset your password
                    - check orders
                    - open your wishlist
                    - manage addresses
                    - view notifications
                    - find support options

                    Just ask me in your own words and I will guide you through the exact screen and tap sequence.
                    """.trim();
        }

        if (isAppNavigationQuestion(q)) {
            return """
                    I can guide you through the Nari Samman app step by step.

                    Try asking me things like:
                    - How to place an order?
                    - How to edit my address?
                    - How to reset my password?
                    - How to check my orders?
                    - How to open my wishlist?

                    I will answer using the exact screen names and buttons from the app.
                    """.trim();
        }

        // Use app-context data when the user asks about their own profile/account.
        if (containsAny(q, "email", "phone", "profile", "account")) {
            String name = extractString(ctx, "user", "name");
            String email = extractString(ctx, "user", "email");
            String phone = extractString(ctx, "user", "phone");
            if (name != null || email != null || phone != null) {
                return "Here is the profile information I can verify right now: "
                        + joinParts(
                                name != null ? "Name: " + name : null,
                                email != null ? "Email: " + email : null,
                                phone != null ? "Phone: " + phone : null
                        ) + ". To edit these details, open Profile and tap Edit.";
            }
        }

        return null;
    }

    private String buildGracefulFallbackReply(AiChatRequest request, String queryText) {
        String localReply = buildLocalAppReply(request, queryText);
        if (localReply != null) {
            return localReply;
        }

        String q = queryText == null ? "" : queryText.toLowerCase(Locale.ROOT);
        if (isAppNavigationQuestion(q) || containsAny(q, "product", "order", "profile", "address", "wishlist", "notification", "vendor", "shg", "support", "login", "register", "password", "checkout", "cart")) {
            return """
                    I can guide you through Nari Samman step by step.

                    Ask me about:
                    - placing an order
                    - editing or adding an address
                    - resetting a password
                    - logging in or registering
                    - checking orders or wishlist
                    - notifications, vendors, or SHGs

                    I’ll explain the exact screen and button names from the app.
                    """.trim();
        }

        return """
                I can help with Nari Samman app steps, account guidance, order help, product discovery, addresses, wishlist, notifications, vendors, and SHGs.

                Try asking in a more specific way, for example:
                - How to place an order?
                - How to reset my password?
                - How to edit my address?
                - What can you tell me about women SHGs?
                """.trim();
    }

    private boolean isGreetingQuery(String q) {
        return containsAny(q, "hi", "hello", "hey", "good morning", "good afternoon", "good evening");
    }

    private boolean isRegisterHelpQuery(String q) {
        return containsAny(q, "register", "sign up", "signup", "create account", "new account", "consumer registration");
    }

    private boolean isLoginHelpQuery(String q) {
        return containsAny(q, "login", "sign in", "log in", "signin", "consumer login");
    }

    private boolean isPasswordHelpQuery(String q) {
        return containsAny(q, "forgot password", "reset password", "change password", "recover password", "set new password")
                || (containsAny(q, "password") && containsAny(q, "forgot", "reset", "change", "recover", "rest"));
    }

    private boolean isPlaceOrderHelpQuery(String q) {
        return containsAny(q, "how to place an order", "place an order", "how do i order", "how do i buy", "how to buy", "checkout", "buy now", "add to cart")
                || (containsAny(q, "order", "buy", "purchase") && containsAny(q, "place", "complete", "checkout", "cart"));
    }

    private boolean isAddressHelpQuery(String q) {
        return containsAny(q, "edit address", "change address", "update address", "add address", "delivery address", "saved addresses", "shipping address")
                || (containsAny(q, "address") && containsAny(q, "edit", "change", "update", "add", "saved", "delivery", "shipping"));
    }

    private boolean isOrderStatusHelpQuery(String q) {
        return containsAny(q, "track my order", "track order", "where is my order", "order status", "delivery status", "my orders", "my order", "where is it now")
                || (containsAny(q, "order", "orders") && containsAny(q, "track", "status", "delivery", "where"));
    }

    private boolean isAppNavigationQuestion(String q) {
        return containsAny(q, "how to", "how do i", "how can i", "where do i", "where is", "steps to", "show me", "guide me", "walk me through", "how should i")
                && containsAny(q, "order", "orders", "product", "products", "address", "profile", "wishlist", "notification", "login", "register", "password", "checkout", "cart", "payment", "vendor", "shg", "support");
    }

    private String joinParts(String... parts) {
        StringBuilder sb = new StringBuilder();
        for (String part : parts) {
            if (part == null || part.isBlank()) {
                continue;
            }
            if (sb.length() > 0) {
                sb.append(" ");
            }
            sb.append(part.trim());
        }
        return sb.toString();
    }

    private String extractString(Map<String, Object> context, String outerKey, String innerKey) {
        if (context == null) {
            return null;
        }
        Object outer = context.get(outerKey);
        if (outer instanceof Map<?, ?> map) {
            Object value = map.get(innerKey);
            if (value != null) {
                String text = String.valueOf(value).trim();
                return text.isEmpty() || "null".equalsIgnoreCase(text) ? null : text;
            }
        }
        return null;
    }

    private List<GroqApiDto.GroqMessage> buildGroqMessages(AiChatRequest request) {
        List<GroqApiDto.GroqMessage> messages = new ArrayList<>();
        messages.add(new GroqApiDto.GroqMessage("system", buildSystemPrompt(request)));

        if (request.getMessages() != null) {
            for (AiChatRequest.MessageDto msg : request.getMessages()) {
                String role = msg.getRole();
                if ("user".equals(role) || "assistant".equals(role)) {
                    messages.add(new GroqApiDto.GroqMessage(role, msg.getContent()));
                }
            }
        }

        return messages;
    }

    private String buildSystemPrompt(AiChatRequest request) {
        String appGuide = """
                You are Nari AI, the in-app assistant for Nari Samman.

                You are not a FAQ bot. You are an application guide.

                Your job:
                - Explain how to use the app with step-by-step instructions.
                - Mention the exact screen, tab, button, and field names the user should tap or fill.
                - Use verified backend/app context before answering about account data, orders, products, wishlist, addresses, notifications, vendors, or SHGs.
                - Ask one short follow-up question when the request is unclear.
                - Be warm, practical, and specific.
                - Do not invent screens or buttons that do not exist in Nari Samman.
                - Do not guess private data.

                App flow knowledge:
                - Consumer login screen has Sign In and Register tabs.
                - Register flow asks for full name, email, mobile number, OTP, password, and confirm password.
                - Forgot Password is available from the login screen.
                - Forgot Password flow asks for mobile number, OTP verification, new password, and confirm password.
                - Profile screen contains My Orders, Wishlist, Saved Addresses, Notifications, Reset Password, Payment Methods, Impact Stories, Help & Support, and Terms & Privacy.
                - Reset Password is opened from Profile -> Reset Password.
                - My Orders is opened from Profile -> My Orders.
                - Wishlist is opened from Profile -> Wishlist.
                - Saved Addresses is opened from Profile -> Saved Addresses.
                - Notifications is opened from Profile -> Notifications.
                - Help & Support is opened from Profile -> Help & Support.

                Response style:
                - If the user asks how to do something inside the app, give detailed numbered or paragraph-style steps.
                - If the user asks about account data, quote only verified information from context.
                - If the user asks about products or marketplace help, be conversational but still precise.
                - If data is missing, explain what is missing and what screen or action the user should check next.
                """;

        return appGuide + "\n\nVerified request context:\n" + buildContextPrompt(request);
    }

    private String buildContextPrompt(AiChatRequest request) {
        StringBuilder sb = new StringBuilder();
        sb.append("Conversation metadata:\n");
        if (request.getConversationId() != null) {
            sb.append("- conversationId: ").append(request.getConversationId()).append('\n');
        }
        if (request.getCurrentScreen() != null) {
            sb.append("- currentScreen: ").append(request.getCurrentScreen()).append('\n');
        }
        if (request.getResponseMode() != null) {
            sb.append("- responseMode: ").append(request.getResponseMode()).append('\n');
        }

        sb.append("\nContext payload:\n");
        sb.append(formatAny(request.getContext()));
        return sb.toString().trim();
    }

    private String formatAny(Object value) {
        if (value == null) {
            return "- none";
        }
        if (value instanceof Map<?, ?> map) {
            StringBuilder sb = new StringBuilder();
            for (Map.Entry<?, ?> entry : map.entrySet()) {
                sb.append("- ").append(String.valueOf(entry.getKey())).append(": ")
                        .append(formatAny(entry.getValue())).append('\n');
            }
            return sb.toString().trim();
        }
        if (value instanceof Collection<?> collection) {
            StringBuilder sb = new StringBuilder();
            int index = 0;
            for (Object item : collection) {
                sb.append("- [").append(index++).append("] ").append(formatAny(item)).append('\n');
            }
            return sb.toString().trim();
        }
        return String.valueOf(value);
    }

    private String extractReply(GroqApiDto.GroqResponse response) {
        if (response == null
                || response.getChoices() == null
                || response.getChoices().isEmpty()) {
            throw new IllegalStateException("Groq returned an empty response with no choices.");
        }

        GroqApiDto.GroqChoice choice = response.getChoices().get(0);
        if (choice.getMessage() == null || choice.getMessage().getContent() == null) {
            throw new IllegalStateException("Groq response choice contains no message content.");
        }

        return choice.getMessage().getContent().trim();
    }

}
