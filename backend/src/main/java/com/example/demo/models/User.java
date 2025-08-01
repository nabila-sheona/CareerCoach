// model/User.java
package com.careercoach.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  private String name;

  @Email
  @NotBlank
  @Column(unique = true)
  private String email;

  @NotBlank
  private String password; // Hashed password

  private String role = "USER";
}
