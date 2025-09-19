package com.careercoach.config;

import com.careercoach.models.User;
import com.careercoach.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if any users exist
        if (userRepository.count() == 0) {
            // Create a test user
            User testUser = User.builder()
                    .name("Test User")
                    .email("test@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .build();
            
            userRepository.save(testUser);
            System.out.println("Test user created: test@example.com / password123");
            
            // Create another test user
            User fayazUser = User.builder()
                    .name("Fayaz Sahib")
                    .email("fayaz@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .build();
            
            userRepository.save(fayazUser);
            System.out.println("Test user created: fayaz@example.com / password123");
        }
    }
}