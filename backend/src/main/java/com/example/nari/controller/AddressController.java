package com.example.nari.controller;

import com.example.nari.dto.AddressRequest;
import com.example.nari.dto.AddressResponse;
import com.example.nari.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "*")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    /**
     * GET /api/addresses/consumer/{consumerId} Fetch all addresses for a
     * consumer.
     */
    @GetMapping("/consumer/{consumerId}")
    public ResponseEntity<?> getAddresses(@PathVariable Long consumerId, Authentication auth) {
        if (!isOwner(auth, consumerId)) {
            return forbidden();
        }
        try {
            List<AddressResponse> addresses = addressService.getAddresses(consumerId);
            return ResponseEntity.ok(Map.of("success", true, "addresses", addresses));
        } catch (Exception e) {
            return serverError(e.getMessage());
        }
    }

    /**
     * POST /api/addresses Add a new address. consumerId comes from the JWT, not
     * the body.
     */
    @PostMapping
    public ResponseEntity<?> addAddress(@Valid @RequestBody AddressRequest request,
            Authentication auth) {
        Long consumerId = extractConsumerId(auth);
        if (consumerId == null) {
            return unauthorized();
        }
        try {
            AddressResponse address = addressService.addAddress(consumerId, request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("success", true, "address", address,
                            "message", "Address added successfully"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return serverError(e.getMessage());
        }
    }

    /**
     * PUT /api/addresses/{id} Update an existing address.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable Long id,
            @Valid @RequestBody AddressRequest request,
            Authentication auth) {
        Long consumerId = extractConsumerId(auth);
        if (consumerId == null) {
            return unauthorized();
        }
        try {
            AddressResponse address = addressService.updateAddress(consumerId, id, request);
            return ResponseEntity.ok(Map.of("success", true, "address", address,
                    "message", "Address updated successfully"));
        } catch (SecurityException e) {
            return forbidden();
        } catch (IllegalArgumentException e) {
            return notFound(e.getMessage());
        } catch (Exception e) {
            return serverError(e.getMessage());
        }
    }

    /**
     * DELETE /api/addresses/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id, Authentication auth) {
        Long consumerId = extractConsumerId(auth);
        if (consumerId == null) {
            return unauthorized();
        }
        try {
            addressService.deleteAddress(consumerId, id);
            return ResponseEntity.ok(Map.of("success", true,
                    "message", "Address deleted successfully"));
        } catch (SecurityException e) {
            return forbidden();
        } catch (IllegalArgumentException e) {
            return notFound(e.getMessage());
        } catch (Exception e) {
            return serverError(e.getMessage());
        }
    }

    /**
     * PUT /api/addresses/{id}/default Set an address as the default.
     */
    @PutMapping("/{id}/default")
    public ResponseEntity<?> setDefault(@PathVariable Long id, Authentication auth) {
        Long consumerId = extractConsumerId(auth);
        if (consumerId == null) {
            return unauthorized();
        }
        try {
            AddressResponse address = addressService.setDefault(consumerId, id);
            return ResponseEntity.ok(Map.of("success", true, "address", address,
                    "message", "Default address updated"));
        } catch (SecurityException e) {
            return forbidden();
        } catch (IllegalArgumentException e) {
            return notFound(e.getMessage());
        } catch (Exception e) {
            return serverError(e.getMessage());
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────
    private Long extractConsumerId(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) {
            return null;
        }
        return (Long) auth.getPrincipal();
    }

    private boolean isOwner(Authentication auth, Long requestedId) {
        Long id = extractConsumerId(auth);
        return id != null && id.equals(requestedId);
    }

    private ResponseEntity<?> forbidden() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("success", false, "message", "Access denied"));
    }

    private ResponseEntity<?> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("success", false, "message", "Authentication required"));
    }

    private ResponseEntity<?> notFound(String msg) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", msg));
    }

    private ResponseEntity<?> serverError(String msg) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false,
                        "message", msg != null ? msg : "Something went wrong"));
    }
}
