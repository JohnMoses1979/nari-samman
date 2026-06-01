package com.example.nari.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Serves product images from the filesystem.
 * GET /api/product-images/{vendorId}/{filename}
 */
@RestController
@RequestMapping("/api/product-images")
@CrossOrigin(origins = "*")
public class ProductImageServeController {

    @Value("${product.upload.dir:uploads/products}")
    private String uploadDir;

    @GetMapping("/{vendorId}/{filename:.+}")
    public ResponseEntity<Resource> serveImage(
            @PathVariable String vendorId,
            @PathVariable String filename) {
        try {
            Path root = resolveRoot();
            Path filePath = root.resolve(vendorId).resolve(filename).normalize();

            // Security: ensure path is still under root
            if (!filePath.startsWith(root)) {
                return ResponseEntity.badRequest().build();
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = guessContentType(filename);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=86400")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private Path resolveRoot() {
        Path raw = Paths.get(uploadDir);
        if (raw.isAbsolute()) return raw.normalize();
        return Paths.get(System.getProperty("user.dir"), raw.toString()).toAbsolutePath().normalize();
    }

    private String guessContentType(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".png"))  return "image/png";
        if (lower.endsWith(".webp")) return "image/webp";
        return "image/jpeg";
    }
}