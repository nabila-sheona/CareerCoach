package com.careercoach.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.*;
import lombok.*;

@Document(collection = "users")  // This tells Spring it's a MongoDB document
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id  // This is Spring Data's @Id for MongoDB
    private String id;  // MongoDB IDs are usually Strings (ObjectId)

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password; // Hashed password

    private String role = "USER";
}