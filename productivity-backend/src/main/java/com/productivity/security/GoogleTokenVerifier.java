package com.productivity.security;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

/**
 * Google ID Token verifier using Google's official verification mechanism.
 * 
 * SECURITY DECISION: We use Google's official GoogleIdTokenVerifier which:
 * 1. Fetches Google's public keys from https://www.googleapis.com/oauth2/v3/certs
 * 2. Verifies the token signature using those keys
 * 3. Validates the issuer (accounts.google.com or https://accounts.google.com)
 * 4. Validates the audience matches our client ID
 * 5. Checks token expiration
 * 6. Verifies email_verified claim
 * 
 * We NEVER decode the token manually or trust unsigned claims.
 * 
 * The Google Client ID is loaded from environment variables and must match
 * the OAuth 2.0 Client ID configured in Google Cloud Console.
 */
@Component
public class GoogleTokenVerifier {

    private final GoogleIdTokenVerifier verifier;

    public GoogleTokenVerifier(@Value("${google.client.id}") String googleClientId) {
        if (googleClientId == null || googleClientId.isEmpty() || 
            googleClientId.equals("YOUR_GOOGLE_CLIENT_ID")) {
            throw new IllegalStateException(
                "GOOGLE_CLIENT_ID must be configured. " +
                "Get it from Google Cloud Console > APIs & Services > Credentials"
            );
        }

        this.verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance()
        )
        .setAudience(Collections.singletonList(googleClientId))
        .build();
    }

    /**
     * Verify a Google ID token and extract the payload.
     * 
     * @param idTokenString The Google ID token (credential from Google Sign-In)
     * @return Verified GoogleIdToken.Payload containing user information
     * @throws SecurityException if verification fails
     */
    public GoogleIdToken.Payload verify(String idTokenString) {
        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            
            if (idToken == null) {
                throw new SecurityException("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            // Additional security checks
            if (!payload.getEmailVerified()) {
                throw new SecurityException("Email not verified by Google");
            }

            if (payload.getSubject() == null || payload.getSubject().isEmpty()) {
                throw new SecurityException("Missing Google subject ID");
            }

            if (payload.getEmail() == null || payload.getEmail().isEmpty()) {
                throw new SecurityException("Missing email in Google token");
            }

            return payload;

        } catch (GeneralSecurityException | IOException e) {
            throw new SecurityException("Google token verification failed: " + e.getMessage(), e);
        }
    }
}
