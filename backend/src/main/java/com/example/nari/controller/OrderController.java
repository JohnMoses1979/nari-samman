package com.example.nari.controller;

import com.example.nari.dto.OrderCreateRequest;
import com.example.nari.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(@RequestBody OrderCreateRequest request, Authentication auth) {
        try {
            Long consumerId = extractLongPrincipal(auth);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "order", orderService.createOrder(consumerId, request)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/orders/consumer/{consumerId}")
    public ResponseEntity<?> consumerOrders(@PathVariable Long consumerId, Authentication auth) {
        if (!isAdmin(auth) && !isOwner(auth, consumerId)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Access denied"));
        }
        return ResponseEntity.ok(Map.of("success", true, "orders", orderService.getConsumerOrders(consumerId)));
    }

    @GetMapping("/vendors/{vendorId}/orders")
    public ResponseEntity<?> vendorOrders(@PathVariable Long vendorId, Authentication auth) {
        if (!isAdmin(auth) && !isOwner(auth, vendorId)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Access denied"));
        }
        return ResponseEntity.ok(Map.of("success", true, "vendorOrders", orderService.getVendorOrders(vendorId)));
    }

    @PutMapping("/vendors/{vendorId}/orders/{vendorOrderId}/pack")
    public ResponseEntity<?> packVendorOrder(@PathVariable Long vendorId, @PathVariable String vendorOrderId, Authentication auth) {
        if (!isOwner(auth, vendorId)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Access denied"));
        }
        try {
            return ResponseEntity.ok(Map.of("success", true, "vendorOrder", orderService.markPacked(vendorId, vendorOrderId)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/vendors/{vendorId}/orders/{vendorOrderId}/send-to-logistics")
    public ResponseEntity<?> sendToLogistics(@PathVariable Long vendorId, @PathVariable String vendorOrderId, Authentication auth) {
        if (!isOwner(auth, vendorId)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Access denied"));
        }
        try {
            return ResponseEntity.ok(Map.of("success", true, "vendorOrder", orderService.sendToLogistics(vendorId, vendorOrderId)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/admin/orders")
    public ResponseEntity<?> adminOrders(Authentication auth) {
        if (!isAdmin(auth)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
        }
        return ResponseEntity.ok(Map.of(
                "success", true,
                "orders", orderService.getAllConsumerOrders(),
                "vendorOrders", orderService.getAllVendorOrders()
        ));
    }

    @GetMapping("/admin/dispatches")
    public ResponseEntity<?> adminDispatches(Authentication auth) {
        if (!isAdmin(auth)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
        }
        return ResponseEntity.ok(Map.of("success", true, "dispatches", orderService.getDispatches()));
    }

    @PutMapping("/admin/dispatches/{dispatchId}/status")
    public ResponseEntity<?> updateDispatch(@PathVariable String dispatchId, @RequestBody Map<String, String> body, Authentication auth) {
        if (!isAdmin(auth)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
        }
        try {
            return ResponseEntity.ok(Map.of("success", true, "dispatch", orderService.updateDispatchStatus(dispatchId, body.get("status"))));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    private Long extractLongPrincipal(Authentication auth) {
        if (auth != null && auth.getPrincipal() instanceof Long value) {
            return value;
        }
        return null;
    }

    private boolean isOwner(Authentication auth, Long requestedId) {
        Long principal = extractLongPrincipal(auth);
        return principal != null && principal.equals(requestedId);
    }

    private boolean isAdmin(Authentication auth) {
        return auth != null && auth.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }
}
