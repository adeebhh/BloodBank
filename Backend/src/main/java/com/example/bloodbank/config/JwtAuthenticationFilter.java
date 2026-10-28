package com.example.bloodbank.config;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.example.bloodbank.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }
    @Override
    protected void doFilterInternal( HttpServletRequest request, HttpServletResponse response,
        FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        System.out.println("REQUEST: " + request.getRequestURI());
        System.out.println("AUTH HEADER: " + authHeader);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String email = jwtService.extractEmail(token);
                String role = jwtService.extractRole(token);
                System.out.println("JWT EMAIL: " + email);
                System.out.println("JWT ROLE: " + role);
                if (email != null &&
                        SecurityContextHolder.getContext().getAuthentication() == null) {
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken( email,null,
                                    List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase() ) ) );
                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);
                    System.out.println("JWT AUTHENTICATION SUCCESS");
                }
            } catch (Exception e) {
                System.out.println("JWT ERROR: " + e.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }
}