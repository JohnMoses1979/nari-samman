package com.example.nari.controller;

import com.example.nari.dto.ProductResponse;
import com.example.nari.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Public product endpoints for consumers — only APPROVED products.
 *
 * GET /api/products               — all approved (optional ?category=food|textiles|crafts)
 * GET /api/products/{id}          — single approved product detail
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ConsumerProductController {

    private final ProductService productService;

    public ConsumerProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<?> getApprovedProducts(
            @RequestParam(value = "category", required = false) String category) {
        try {
            List<ProductResponse> products = productService.getApprovedProducts(category);
            return ResponseEntity.ok(Map.of("success", true, "products", products));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductDetail(@PathVariable Long id) {
        try {
            ProductResponse product = productService.getProductDetail(id);
            return ResponseEntity.ok(Map.of("success", true, "product", product));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}