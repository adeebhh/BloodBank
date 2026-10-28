package com.example.bloodbank.service;

import com.example.bloodbank.dto.NotificationDTO;
import com.example.bloodbank.entity.Notification;
import com.example.bloodbank.exception.ResourceNotFoundException;
import com.example.bloodbank.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    public Notification addNotification(NotificationDTO dto) {

        Notification notification = Notification.builder()
                .title(dto.getTitle())
                .message(dto.getMessage())
                .type(dto.getType())
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        return repository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return repository.findAll();
    }

    public Notification getNotificationById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
    }

    public Notification markAsRead(Long id) {

        Notification notification = getNotificationById(id);
        notification.setIsRead(true);

        return repository.save(notification);
    }

    public String deleteNotification(Long id) {

        Notification notification = getNotificationById(id);
        repository.delete(notification);

        return "Notification Deleted Successfully";
    }
}