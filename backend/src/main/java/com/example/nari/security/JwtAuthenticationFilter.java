package com.example.nari.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Locale;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String token = extractToken(request);

        if (StringUtils.hasText(token) && jwtUtil.validateToken(token)) {
            String role = jwtUtil.extractRole(token);
            String subject = jwtUtil.extractSubject(token);

            String normalizedRole = role != null ? role.toUpperCase(Locale.ROOT) : "CONSUMER";

            Object principal;
            String springRole;

            if ("ADMIN".equals(normalizedRole)) {
                principal = "admin:" + jwtUtil.extractEmail(token);
                springRole = "ROLE_ADMIN";
            } else if ("VENDOR".equals(normalizedRole)) {
                principal = parseLongOrNull(subject);
                springRole = "ROLE_VENDOR";
            } else {
                principal = parseLongOrNull(subject);
                springRole = "ROLE_CONSUMER";
            }

            if (principal != null) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                principal,
                                null,
                                List.of(new SimpleGrantedAuthority(springRole))
                        );
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Parse "Authorization: Bearer <token>" header.
     */
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    private Long parseLongOrNull(String value) {
        try {
            return value != null ? Long.parseLong(value) : null;
        } catch (NumberFormatException ignored) {
            return null;
        }
    }
}
