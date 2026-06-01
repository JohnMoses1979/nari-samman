package com.example.nari.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration.ms}")
    private long jwtExpirationMs;

    private Key getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes();
        if (keyBytes.length < 32) {
            byte[] padded = new byte[32];
            System.arraycopy(keyBytes, 0, padded, 0, keyBytes.length);
            keyBytes = padded;
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Backward compatible generator (defaults to CONSUMER role).
     */
    public String generateToken(Long consumerId, String email) {
        return generateToken(String.valueOf(consumerId), email, "CONSUMER");
    }

    public String generateConsumerToken(Long consumerId, String email) {
        return generateToken(String.valueOf(consumerId), email, "CONSUMER");
    }

    public String generateVendorToken(Long vendorId, String email) {
        return generateToken(String.valueOf(vendorId), email, "VENDOR");
    }

    public String generateAdminToken(String adminEmail) {
        return generateToken("admin", adminEmail, "ADMIN");
    }

    public String generateToken(String subject, String email, String role) {
        return Jwts.builder()
                .setSubject(subject)
                .claim("email", email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractSubject(String token) {
        return parseClaims(token).getSubject();
    }

    public String extractRole(String token) {
        Object role = parseClaims(token).get("role");
        return role != null ? role.toString() : null;
    }

    public String extractEmail(String token) {
        Object email = parseClaims(token).get("email");
        return email != null ? email.toString() : null;
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.err.println("JWT expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.println("JWT unsupported: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.err.println("JWT malformed: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("JWT empty: " + e.getMessage());
        }
        return false;
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

