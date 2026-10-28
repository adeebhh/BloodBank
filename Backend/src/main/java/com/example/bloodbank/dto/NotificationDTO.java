package com.example.bloodbank.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private String title;
    private String message;
    private String type;
    private Boolean isRead;
}