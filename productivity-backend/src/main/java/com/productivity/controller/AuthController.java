package com.productivity.controller;

import com.productivity.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Authenticate with Google ID token.
     * 
     * Request body:
     * {
     *   "credential": "eyJhbGciOiJSUzI1NiIs..." (Google ID token from Google Sign-In)
     * }
     * 
     * Response:
     * {
     *   "success": true,
     *   "user": { "id": "...", "email": "...", "name": "...", "picture": "..." },
     *   "accessToken": "eyJhbGciOiJIUzUxMiJ9...", (MySpace JWT)
     *   "tokenType": "Bearer"
     * }
     */
    @PostMapping("/google")
    public ResponseEntity<Map<String, Object>> authenticateWithGoogle(
            @Valid @RequestBody GoogleAuthRequest request
    ) {
        try {
            Map<String, Object> response = authService.authenticateWithGoogle(request.credential());
            return ResponseEntity.ok(response);
        } catch (SecurityException e) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "error", "Authentication failed",
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Internal server error",
                "message", "An unexpected error occurred"
            ));
        }
    }

    /**
     * Logout endpoint (optional - client can just discard the token).
     * Included for completeness and potential future token revocation.
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        // With stateless JWT, logout is handled client-side by discarding the token.
        // This endpoint exists for API completeness and potential future token blacklisting.
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Logged out successfully"
        ));
    }

    /**
     * Request DTO for Google authentication.
     */
    public record GoogleAuthRequest(
        @NotBlank(message = "Google credential is required")
        String credential
    ) {}
}
