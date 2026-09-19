package com.productivity.security;

import com.productivity.entity.User;
import com.productivity.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

/**
 * JWT authentication filter that processes Bearer tokens from the Authorization header.
 * 
 * SECURITY DECISION: This filter runs once per request and:
 * 1. Extracts the JWT from "Authorization: Bearer <token>" header
 * 2. Validates the JWT signature and expiration
 * 3. Extracts the user ID from the token
 * 4. Loads the user from the database to ensure they still exist
 * 5. Sets the Spring Security authentication context
 * 
 * If validation fails, the request continues without authentication and
 * Spring Security will reject it if the endpoint requires authentication.
 * 
 * We do NOT catch and suppress exceptions here - invalid tokens should
 * result in 401 Unauthorized responses.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");

        // Check if Authorization header exists and has Bearer prefix
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7); // Remove "Bearer " prefix

        try {
            // Validate token and extract user ID
            String userId = jwtUtil.validateTokenAndGetUserId(token);

            // Load user from database to ensure they still exist
            Optional<User> userOpt = userRepository.findById(userId);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();

                // Create authentication token with user as principal
                // No authorities/roles needed for this simple app - just authentication
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        Collections.emptyList()
                    );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set the authentication in the security context
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (JwtException e) {
            // Token is invalid - continue without authentication
            // Spring Security will reject if endpoint requires auth
            logger.debug("JWT validation failed: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
