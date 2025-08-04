package com.careercoach.controllers;

import com.careercoach.models.User;
import com.careercoach.service.UserService;
import com.careercoach.utility.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * The AuthController handles user registration and login.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from frontend
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;  // ✅ Correctly injected as a general PasswordEncoder

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * Registration endpoint: Creates a new user and returns a JWT token
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            if (userService.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(new ApiResponse("Error", "Email is already registered."));
            }

            // Hash password securely
            String hashedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashedPassword);

            User savedUser = userService.register(user);

            String jwtToken = jwtTokenUtil.generateToken(savedUser.getEmail());
            return ResponseEntity.ok(new ApiResponse("Registration successful", jwtToken));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse("Error", "An error occurred during registration."));
        }
    }

    /**
     * Login endpoint: Validates credentials and returns a JWT token if successful
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            User existingUser = userService.findByEmail(user.getEmail()).orElse(null);

            if (existingUser == null || !passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
                return ResponseEntity.status(400).body(new ApiResponse("Error", "Invalid email or password"));
            }

            String jwtToken = jwtTokenUtil.generateToken(existingUser.getEmail());
            return ResponseEntity.ok(new ApiResponse("Login successful", jwtToken));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse("Error", "An error occurred during login."));
        }
    }

    /**
     * API Response class for consistent success and error messaging.
     */
    static class ApiResponse {
        private final String message;
        private final String token;

        public ApiResponse(String message, String token) {
            this.message = message;
            this.token = token;
        }

        public String getMessage() {
            return message;
        }

        public String getToken() {
            return token;
        }
    }
}
