package edu.usc.noteapp.note_taking_system.security;

import edu.usc.noteapp.note_taking_system.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Return user roles/authorities if implemented. For now, return an empty list.
        // If roles/authorities are added, update this logic.
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        // Return the user's password for authentication
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        // Use email as the username for authentication
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        // Define logic if account expiration is implemented
        return true; // Assume the account is not expired
    }

    @Override
    public boolean isAccountNonLocked() {
        // Define logic if account locking is implemented
        return true; // Assume the account is not locked
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // Define logic if credentials expiration is implemented
        return true; // Assume the credentials are not expired
    }

    @Override
    public boolean isEnabled() {
        // Define logic if user enable/disable functionality is implemented
        return true; // Assume the user is enabled
    }

    // Expose the full User object if needed
    public User getUser() {
        return user;
    }
}
