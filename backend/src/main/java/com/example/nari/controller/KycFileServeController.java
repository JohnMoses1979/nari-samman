package com.example.nari.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

/**
 * Serves KYC document images securely.
 * Only authenticated users (vendors owning the file, or admins) can access files.
 *
 * GET /api/kyc-files/{vendorId}/{filename}
 *
 * The URL is constructed by VendorKycService.buildUrl() so it always matches this pattern.
 */
@RestController
@RequestMapping("/api/kyc-files")
@CrossOrigin(origins = "*")
public class KycFileServeController {

    @Value("${kyc.upload.dir:uploads/kyc}")
    private String uploadDir;

    /**
     * Serve a KYC document file.
     * Security note: authentication is enforced by SecurityConfig (route is under /api/kyc-files/** → authenticated).
     * Additionally we validate the vendorId from the URL matches the JWT principal OR the caller is an admin.
     */
    @GetMapping("/{vendorId}/{filename}")
    public ResponseEntity<?> serveFile(
            @PathVariable Long vendorId,
            @PathVariable String filename,
            Authentication auth) {

        // ── Authorization check ───────────────────────────────────────────────
        // Allow if: caller is the owning vendor OR admin (principal string starts with "admin")
        if (auth == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("success", false, "message", "Authentication required"));
        }

        Object principal = auth.getPrincipal();
        boolean isAdmin  = principal instanceof String && ((String) principal).contains("admin");
        boolean isOwner  = principal instanceof Long && ((Long) principal).equals(vendorId);

        if (!isAdmin && !isOwner) {
            return ResponseEntity.status(403)
                    .body(Map.of("success", false, "message", "Access denied"));
        }

        // ── Prevent path traversal ────────────────────────────────────────────
        if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Invalid filename"));
        }

        try {
            Path root = uploadRoot();
            Path filePath = root.resolve(String.valueOf(vendorId)).resolve(filename).normalize();

            // Ensure path stays within upload root (defense in depth)
            if (!filePath.startsWith(root)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Invalid file path"));
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // Determine content type
            String contentType = guessContentType(filename);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Invalid file path"));
        }
    }

    private Path uploadRoot() {
        Path raw = Paths.get(uploadDir);
        if (raw.isAbsolute()) return raw.normalize();
        return Paths.get(System.getProperty("user.dir"), raw.toString())
                .toAbsolutePath()
                .normalize();
    }

    private String guessContentType(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".png"))  return "image/png";
        if (lower.endsWith(".pdf"))  return "application/pdf";
        if (lower.endsWith(".webp")) return "image/webp";
        return "application/octet-stream";
    }
}
