package com.productivity.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT utility for generating and validating MySpace access tokens.
 * 
 * SECURITY DECISION: We use HS512 (HMAC-SHA512) for symmetric signing.
 * The secret is loaded from environment variables and must be at least 64 bytes
 * for HS512 security requirements.
 * 
 * Token contains only minimal claims:
 * - sub: User ID
 * - iat: Issued at time
 * - exp: Expiration time
 * 
 * No sensitive data (email, name, etc.) is stored in the token to minimize
 * exposure if the token is intercepted.
 */
@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms:86400000}") long expirationMs // Default: 24 hours
    ) {
        // Ensure the secret is strong enough for HS512 (requires 512 bits = 64 bytes)
        if (secret == null || secret.length() < 64) {
            throw new IllegalStateException(
                "JWT_SECRET must be at least 64 characters for HS512 security. " +
                "Generate a secure random string: openssl rand -base64 64"
            );
        }
        
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    /**
     * Generate a JWT access token for an authenticated user.
     * 
     * @param userId The authenticated user's ID
     * @return Signed JWT token string
     */
    public String generateToken(String userId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(userId)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(secretKey, Jwts.SIG.HS512)
                .compact();
    }

    /**
     * Validate a JWT token and extract the user ID.
     * 
     * @param token The JWT token to validate
     * @return The user ID if valid
     * @throws JwtException if the token is invalid, expired, or tampered
     */
    public String validateTokenAndGetUserId(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.getSubject();
        } catch (ExpiredJwtException e) {
            throw new JwtException("Token has expired");
        } catch (JwtException e) {
            throw new JwtException("Invalid token: " + e.getMessage());
        }
    }

    /**
     * Check if a token is valid without throwing exceptions.
     * 
     * @param token The JWT token to check
     * @return true if valid, false otherwise
     */
    public boolean isTokenValid(String token) {
        try {
            validateTokenAndGetUserId(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
