package com.example.bloodbank.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers( "/api/auth/**", "/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                .requestMatchers("/api/dashboard/**").hasAnyRole("ADMIN", "STAFF", "USER")
                .requestMatchers("/api/reports/**").hasRole("ADMIN")
                .requestMatchers("/api/donors/**").hasAnyRole("ADMIN", "STAFF", "USER")
                .requestMatchers("/api/blood-units/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/api/inventory/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/api/blood-requests/**") .hasAnyRole("ADMIN", "STAFF", "USER")
                .requestMatchers("/api/camps/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/api/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/notifications").hasAnyRole("STAFF", "USER")
                .requestMatchers(HttpMethod.GET, "/api/notifications/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/notifications/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}