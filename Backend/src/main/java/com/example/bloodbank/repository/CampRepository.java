package com.example.bloodbank.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bloodbank.entity.Camp;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CampRepository extends JpaRepository<Camp, Long> {
    @Query("""
SELECT c.campName, COUNT(d)
FROM Camp c
LEFT JOIN c.donors d
GROUP BY c.campName
""")
List<Object[]> getCampReport();
}

