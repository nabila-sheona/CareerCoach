// controller/AuthController.java
package com.careercoach.controller;

import com.careercoach.model.User;
import com.careercoach.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Match your React frontend
public class AuthController {

  @Autowired
  private UserService userService;

  @PostMapping("/register")
  public User register(@RequestBody User user) {
    return userService.register(user);
  }

  // TODO: Add /login endpoint with JWT in next step
}
