package edu.usc.noteapp.note_taking_system.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;
    private final UserDetailsService userDetailsService;

    public JwtTokenFilter(JwtTokenUtil jwtTokenUtil, UserDetailsService userDetailsService) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Extract token
            String token = getTokenFromRequest(request);
            System.out.println("Received Token: " + token);

            if (token != null) {
                // Validate token
                if (jwtTokenUtil.validateToken(token)) {
                    String email = jwtTokenUtil.getUsernameFromToken(token);
                    System.out.println("Authenticated Email: " + email);

                    // Load user details
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                    // Set authentication
                    Authentication authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    System.err.println("Invalid token detected.");
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token.");
                    return; // Stop further processing
                }
            }
        } catch (Exception ex) {
            System.err.println("Authentication error: " + ex.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed.");
            return; // Stop further processing
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

