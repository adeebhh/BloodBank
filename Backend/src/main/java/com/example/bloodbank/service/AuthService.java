package com.example.bloodbank.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.bloodbank.dto.LoginRequest;
import com.example.bloodbank.dto.LoginResponse;
import com.example.bloodbank.dto.RegisterRequest;
import com.example.bloodbank.entity.User;
import com.example.bloodbank.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) return "Email already exists";

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        userRepository.save(user);
        return "User Registered Successfully";
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid Email or Password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid Email or Password");

        String token = jwtService.generateToken(user.getEmail(), user.getRole());

        return new LoginResponse("Login Successful", token, user.getRole());
    }
}