package edu.usc.noteapp.note_taking_system.controller;

import edu.usc.noteapp.note_taking_system.model.User;
import edu.usc.noteapp.note_taking_system.repository.UserRepository;
import edu.usc.noteapp.note_taking_system.security.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    // Registration Endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> userRequest) {
        String username = userRequest.get("username");
        String email = userRequest.get("email");
        String password = userRequest.get("password");
        String confirmPassword = userRequest.get("confirmPassword");

        // Validate required fields
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required!"));
        }
        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid email format!"));
        }
        if (username == null || username.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is required!"));
        }
        if (password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password is required!"));
        }
        if (password.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 6 characters long!"));
        }
        if (!password.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Passwords do not match!"));
        }

        // Check for duplicate email
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email already exists!"));
        }

        // Save user with encoded password
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }

    // Login Endpoint
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> userRequest) {
        String email = userRequest.get("email");
        String password = userRequest.get("password");

        if (email == null || email.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Email is required!"));
        }

        if (password == null || password.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Password is required!"));
        }

        Optional<User> existingUser = userRepository.findByEmail(email);

        // Validate user credentials
        if (existingUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Email does not exist!"));
        }

        if (!passwordEncoder.matches(password, existingUser.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid password!"));
        }

        // Generate JWT token
        String token = jwtTokenUtil.generateToken(existingUser.get().getUsername());

        // Successful login response
        return ResponseEntity.ok(Map.of(
                "message", "Login successful!",
                "id", existingUser.get().getId(),
                "username", existingUser.get().getUsername(),
                "email", existingUser.get().getEmail(),
                "token", token // Include the generated token
        ));
    }
}
