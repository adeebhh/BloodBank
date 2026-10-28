package com.example.bloodbank.entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "camps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Camp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long campId;

    private String campName;

    private String location;

    private LocalDate campDate;

    private String organizer;

    @OneToMany(mappedBy = "camp", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Donor> donors;
}