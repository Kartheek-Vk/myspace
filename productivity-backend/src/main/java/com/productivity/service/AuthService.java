package com.productivity.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.productivity.entity.User;
import com.productivity.repository.UserRepository;
import com.productivity.security.GoogleTokenVerifier;
import com.productivity.security.JwtUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Authentication service that handles Google OAuth and JWT token generation.
 * 
 * SECURITY FLOW:
 * 1. Frontend receives Google ID token from Google Sign-In
 * 2. Frontend sends Google ID token to /api/auth/google
 * 3. Backend verifies Google token signature, issuer, audience, expiration
 * 4. Backend extracts verified user info (sub, email, name, picture)
 * 5. Backend finds or creates user in database
 * 6. Backend generates MySpace JWT with user ID
 * 7. Backend returns user info + MySpace JWT to frontend
 * 8. Frontend stores JWT and sends it with future requests
 * 
 * We NEVER trust the frontend to provide user identity - we always verify
 * through Google's cryptographic signature.
 */
@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final GoogleTokenVerifier googleTokenVerifier;
    private final JwtUtil jwtUtil;

    public AuthService(
            UserRepository userRepository,
            GoogleTokenVerifier googleTokenVerifier,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.googleTokenVerifier = googleTokenVerifier;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Authenticate user with Google ID token.
     * 
     * @param googleIdToken The Google ID token (credential from Google Sign-In)
     * @return Map containing user info and MySpace JWT access token
     * @throws SecurityException if Google token verification fails
     */
    public Map<String, Object> authenticateWithGoogle(String googleIdToken) {
        // Step 1: Verify Google token cryptographically
        GoogleIdToken.Payload payload = googleTokenVerifier.verify(googleIdToken);

        // Step 2: Extract verified user information
        String googleSubjectId = payload.getSubject();
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String picture = (String) payload.get("picture");

        // Step 3: Find or create user in database
        User user = findOrCreateUser(googleSubjectId, email, name, picture);

        // Step 4: Generate MySpace JWT access token
        String accessToken = jwtUtil.generateToken(user.getId());

        // Step 5: Build response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);

        Map<String, Object> userDto = new HashMap<>();
        userDto.put("id", user.getId());
        userDto.put("email", user.getEmail());
        userDto.put("name", user.getName());
        userDto.put("picture", user.getProfileImageUrl());
        userDto.put("googleId", user.getGoogleSubjectId());

        response.put("user", userDto);
        response.put("accessToken", accessToken);
        response.put("tokenType", "Bearer");

        return response;
    }

    /**
     * Find existing user by Google subject ID or create new user.
     */
    private User findOrCreateUser(String googleSubjectId, String email, String name, String picture) {
        Optional<User> existingUser = userRepository.findByGoogleSubjectId(googleSubjectId);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            // Update profile info if changed
            user.setName(name != null ? name : user.getName());
            user.setProfileImageUrl(picture != null ? picture : user.getProfileImageUrl());
            user.setLastLoginAt(LocalDateTime.now());
            return userRepository.save(user);
        } else {
            // Create new user
            User user = new User();
            user.setGoogleSubjectId(googleSubjectId);
            user.setEmail(email);
            user.setName(name != null ? name : email.split("@")[0]);
            user.setProfileImageUrl(picture);
            user.setLastLoginAt(LocalDateTime.now());
            return userRepository.save(user);
        }
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByGoogleSubjectId(String googleSubjectId) {
        return userRepository.findByGoogleSubjectId(googleSubjectId);
    }
}
