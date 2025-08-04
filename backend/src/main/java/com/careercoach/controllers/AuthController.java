package com.careercoach.controllers;

import com.careercoach.models.User;
import com.careercoach.service.UserService;
import com.careercoach.utility.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * AuthController handles user registration and login functionality.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from your frontend
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * POST /register
     * Handles user registration and returns a JWT token if successful
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            Optional<User> existingUser = userService.findByEmail(user.getEmail());
            if (existingUser.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email is already registered"
                ));
            }

            // Securely hash the password before storing
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userService.register(user);

            // Generate JWT token
            String token = jwtTokenUtil.generateToken(savedUser.getEmail());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "token", token
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Registration failed: " + e.getMessage()
            ));
        }
    }

    /**
     * POST /login
     * Validates credentials and returns a JWT token if successful
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User userRequest) {
        try {
            Optional<User> optionalUser = userService.findByEmail(userRequest.getEmail());
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "message", "Invalid email or password"
                ));
            }

            User existingUser = optionalUser.get();

            boolean passwordMatch = passwordEncoder.matches(
                userRequest.getPassword(), existingUser.getPassword()
            );

            if (!passwordMatch) {
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "message", "Invalid email or password"
                ));
            }

            // Successful login
            String token = jwtTokenUtil.generateToken(existingUser.getEmail());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "token", token
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Login error: " + e.getMessage()
            ));
        }
    }
}
