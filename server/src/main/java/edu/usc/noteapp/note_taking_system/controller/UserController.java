package edu.usc.noteapp.note_taking_system.controller;

import edu.usc.noteapp.note_taking_system.model.User;
import edu.usc.noteapp.note_taking_system.security.JwtTokenUtil;
import edu.usc.noteapp.note_taking_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userRepository.findById(id).map(user -> {
            // Check and update only non-null fields
            if (updatedUser.getUsername() != null) user.setUsername(updatedUser.getUsername());
            if (updatedUser.getEmail() != null) user.setEmail(updatedUser.getEmail());

            if (updatedUser.getFirstName() != null) user.setFirstName(updatedUser.getFirstName());
            if (updatedUser.getLastName() != null) user.setLastName(updatedUser.getLastName());
            if (updatedUser.getBio() != null) user.setBio(updatedUser.getBio());
            if (updatedUser.getPhoneNumber() != null) user.setPhoneNumber(updatedUser.getPhoneNumber());

            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        // Extract username from token
        String username = jwtTokenUtil.getUsernameFromToken(token.substring(7)); // Remove "Bearer "

        // Find the user by username
        Optional<User> currentUser = userRepository.findByUsername(username);

        // Find the user to be deleted
        Optional<User> userToDelete = userRepository.findById(id);

        // Check if current user exists and has permission to delete
        if (currentUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized: User not found"));
        }

        // Check if user to delete exists
        if (userToDelete.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }

        // Allow deletion only if:
        // 1. User is deleting their own account, or
        // 2. User has some admin role (you can add this logic later)
        if (!currentUser.get().getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Unauthorized: You can only delete your own account"));
        }

        // Delete the user
        userRepository.delete(userToDelete.get());

        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable Long id,
                                            @RequestHeader("Authorization") String token,
                                            @RequestBody Map<String, String> passwords) {
        String oldPassword = passwords.get("oldPassword");
        String newPassword = passwords.get("newPassword");
        String confirmPassword = passwords.get("confirmPassword");

        // Validate new password and confirmation match
        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "New password and confirmation do not match."));
        }

        // Validate the token to ensure the request is made by the user
        String username = jwtTokenUtil.getUsernameFromToken(token.substring(7)); // Remove "Bearer "
        Optional<User> currentUser = userRepository.findByUsername(username);

        if (currentUser.isEmpty() || !currentUser.get().getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Unauthorized: You can only change your own password."));
        }

        User user = currentUser.get();

        // Validate the old password using PasswordEncoder
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Old password is incorrect."));
        }

        // Update the password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
    }


}
