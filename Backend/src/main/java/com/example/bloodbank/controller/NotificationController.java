package com.example.bloodbank.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.example.bloodbank.dto.NotificationDTO;
import com.example.bloodbank.entity.Notification;
import com.example.bloodbank.service.NotificationService;
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }
    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'USER')")
    public Notification addNotification(@RequestBody NotificationDTO dto) {
        return service.addNotification(dto);
    }
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Notification> getAllNotifications() {
        return service.getAllNotifications();
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Notification getNotificationById(@PathVariable Long id) {
        return service.getNotificationById(id);
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteNotification(@PathVariable Long id) {
        return service.deleteNotification(id);
    }
}