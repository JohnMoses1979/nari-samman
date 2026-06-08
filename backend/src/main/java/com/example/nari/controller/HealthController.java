package com.example.nari.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<?> root() {
        return ResponseEntity.ok(Map.of(
                "status", "OK",
                "app", "Nari Samman Backend"
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
                "status", "OK",
                "backend", "reachable"
        ));
    }

    @GetMapping("/api/health")
    public ResponseEntity<?> apiHealth() {
        return ResponseEntity.ok(Map.of(
                "status", "OK",
                "backend", "reachable"
        ));
    }
}
