// package com.example.nari.config;
// import com.example.nari.security.JwtAuthenticationFilter;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.web.cors.CorsConfigurationSource;
// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {
//     private final JwtAuthenticationFilter jwtAuthenticationFilter;
//     private final CorsConfigurationSource corsConfigurationSource;
//     public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
//             CorsConfigurationSource corsConfigurationSource) {
//         this.jwtAuthenticationFilter = jwtAuthenticationFilter;
//         this.corsConfigurationSource = corsConfigurationSource;
//     }
//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http
//                 .cors(cors -> cors.configurationSource(corsConfigurationSource))
//                 // Disable CSRF — we use stateless JWT, not sessions
//                 .csrf(csrf -> csrf.disable())
//                 // No session — every request must carry a JWT
//                 .sessionManagement(session
//                         -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                 .authorizeHttpRequests(auth -> auth
//                 // ── Public consumer auth endpoints ────────────────────────────
//                 .requestMatchers(
//                         "/api/consumers/register",
//                         "/api/consumers/login"
//                 ).permitAll()
//                 // ── Public OTP endpoints (no JWT needed during registration) ──
//                 .requestMatchers(
//                         "/api/otp/send",
//                         "/api/otp/verify"
//                 ).permitAll()
//                 // ── Public vendor auth endpoints ──────────────────────────────────────────────
//                 .requestMatchers(
//                         "/api/vendors/register",
//                         "/api/vendors/login"
//                 ).permitAll()
//                 // ── Protected vendor profile endpoints ───────────────────────────────────────
//                 .requestMatchers("/api/vendors/**").authenticated()
//                 // ── Existing payment endpoints — must stay public ─────────────
//                 .requestMatchers("/api/payments/**").permitAll()
//                 // ── Protected consumer profile endpoints ──────────────────────
//                 .requestMatchers("/api/consumers/**").authenticated()
//                 // ── Protected address endpoints ───────────────────────────────────────────────
//                 .requestMatchers("/api/addresses/**").authenticated()
//                 // Allow everything else (future vendor/admin routes)
//                 .anyRequest().permitAll()
//                 )
//                 // Plug in our JWT filter before Spring's default username/password filter
//                 .addFilterBefore(jwtAuthenticationFilter,
//                         UsernamePasswordAuthenticationFilter.class);
//         return http.build();
//     }
//     /**
//      * BCrypt encoder — used by ConsumerService to hash passwords.
//      */
//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }
// }
package com.example.nari.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import com.example.nari.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
            CorsConfigurationSource corsConfigurationSource) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session
                        -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                // ── Public consumer auth endpoints ───────────────────
                .requestMatchers(
                        "/api/consumers/register",
                        "/api/consumers/login",
                        "/api/consumers/check-phone",
                        "/api/consumers/reset-password"
                ).permitAll()
                // ── Public OTP endpoints ─────────────────────────────
                .requestMatchers(
                        "/api/otp/send",
                        "/api/otp/verify"
                ).permitAll()
                // ── Public vendor auth endpoints ─────────────────────
                .requestMatchers(
                        "/api/vendors/register",
                        "/api/vendors/login",
                        "/api/vendors/check-phone",
                        "/api/vendors/reset-password"
                ).permitAll()
                .requestMatchers("/api/ai/**").permitAll()
                // ── Public product browsing (consumers) ─────────────────────────────
                .requestMatchers("/api/products").permitAll()
                .requestMatchers("/api/products/**").permitAll()
                // ── Product image file serving (public) ─────────────────────────────
                .requestMatchers("/api/product-images/**").permitAll()
                // ── Admin product review (JWT required, already under /api/admin/**) ─
                // Already covered by: .requestMatchers("/api/admin/**").authenticated()

                // ── Vendor product CRUD (JWT required, already under /api/vendors/**) ─
                // Already covered by: .requestMatchers("/api/vendors/**").authenticated()

                // ── Existing payment endpoints — public ──────────────
                .requestMatchers("/api/payments/**").permitAll()
                .requestMatchers("/api/admin/login").permitAll()
                // ── Admin KYC endpoints — JWT required ───────────────
                // (Admin role check is done in AdminKycController itself
                //  via the admin token; tighten with hasRole("ADMIN") once
                //  you add roles to your JWT claims)
                .requestMatchers("/api/admin/**").authenticated()
                // ── KYC file serving — JWT required ─────────────────
                .requestMatchers("/api/kyc-files/**").authenticated()
                // ── Vendor KYC submission endpoint ───────────────────
                .requestMatchers("/api/vendors/*/kyc").authenticated()
                .requestMatchers("/api/vendors/*/kyc/status").authenticated()
                // ── Protected vendor profile endpoints ───────────────
                .requestMatchers("/api/vendors/**").authenticated()
                // ── Protected consumer profile endpoints ─────────────
                .requestMatchers("/api/consumers/**").authenticated()
                // ── Protected address endpoints ──────────────────────
                .requestMatchers("/api/addresses/**").authenticated()
                // Allow everything else
                .anyRequest().permitAll()
                )
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
