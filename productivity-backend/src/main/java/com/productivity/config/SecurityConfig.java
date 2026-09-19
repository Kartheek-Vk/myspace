package com.productivity.config;

import com.productivity.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security configuration for MySpace API.
 * 
 * SECURITY DECISIONS:
 * 
 * 1. CSRF DISABLED: We use JWT tokens in the Authorization header, not cookies.
 *    CSRF attacks target cookie-based authentication. Since our tokens are stored
 *    in memory/localStorage and sent explicitly by the client, CSRF is not applicable.
 *    See: https://security.stackexchange.com/questions/166724/should-i-use-csrf-protection-on-rest-api-endpoints
 * 
 * 2. STATELESS SESSIONS: We don't create HTTP sessions. Each request is authenticated
 *    independently via the JWT token. This enables horizontal scaling and reduces
 *    server-side state.
 * 
 * 3. PUBLIC ENDPOINTS: Only authentication endpoints and health checks are public.
 *    All business logic endpoints require valid JWT authentication.
 * 
 * 4. CORS: Configured to allow only the frontend origin(s) from environment variables.
 *    We do NOT use "*" in production.
 * 
 * 5. JWT FILTER: Added before UsernamePasswordAuthenticationFilter to process
 *    Bearer tokens and set the SecurityContext before Spring Security checks.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Value("${cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF - we use JWT tokens, not cookies
            .csrf(AbstractHttpConfigurer::disable)
            
            // Configure CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Stateless session management - no HTTP sessions
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // Authorization rules
            .authorizeHttpRequests(authz -> authz
                // Public endpoints - no authentication required
                .requestMatchers(
                    "/api/auth/**",           // Authentication endpoints
                    "/api/health",            // Health check
                    "/actuator/health",       // Spring Boot Actuator health
                    "/h2-console/**"          // H2 console (dev only)
                ).permitAll()
                
                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            
            // Add JWT filter before Spring Security's authentication filter
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            )
            
            // Allow H2 console to use frames (dev only)
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.sameOrigin())
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Parse comma-separated origins from environment variable
        // In production, this should be a specific domain, not "*"
        List<String> origins = Arrays.asList(allowedOrigins.split(","));
        configuration.setAllowedOrigins(origins.stream()
            .map(String::trim)
            .toList());
        
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));
        
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin"
        ));
        
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization"
        ));
        
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
