package com.careercoach.utility;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenUtil {

    private static final String SECRET_KEY = "5285c86171d75f06590f986376e29c11f660109cc7a3f2b041432f3aa0fea73b"; // Secure key for signing tokens

    // Generate a JWT token based on the user's email
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email) // Set the email as the subject (or username)
                .setIssuedAt(new Date()) // Set the issued timestamp
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // Token expiration time (1 hour)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY) // Sign the token with HS256 algorithm and SECRET_KEY
                .compact(); // Build and return the token
    }

    // Validate the JWT token
    public boolean validateToken(String token) {
        return !isTokenExpired(token); // Check if the token is expired
    }

    // Check if the token is expired
    private boolean isTokenExpired(String token) {
        Date expiration = extractExpirationDate(token); // Extract the expiration date from the token
        return expiration.before(new Date()); // Compare it with the current date
    }

    // Extract the username (email) from the token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject); // Extract the 'subject' (email) from the token claims
    }

    // Extract expiration date from token
    public Date extractExpirationDate(String token) {
        return extractClaim(token, Claims::getExpiration); // Extract the expiration date from the token
    }

    // Extract a claim (like username or expiration date) from the token
    private <T> T extractClaim(String token, ClaimsResolver<T> claimsResolver) {
        Claims claims = extractAllClaims(token); // Extract all claims from the token
        return claimsResolver.resolve(claims); // Resolve and return the specific claim
    }

    // Extract all claims from the token (used for extracting subject, expiration, etc.)
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY) // Set the signing key (same as used to sign the token)
                .parseClaimsJws(token) // Parse the claims from the JWT
                .getBody(); // Return the claims body
    }

    // Functional interface to resolve claims
    @FunctionalInterface
    interface ClaimsResolver<T> {
        T resolve(Claims claims);
    }
}
