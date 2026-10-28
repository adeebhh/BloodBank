package com.example.bloodbank.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CampDTO {

    private String campName;

    private String location;

    private LocalDate campDate;

    private String organizer;
}