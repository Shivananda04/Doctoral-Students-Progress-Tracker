package com.example.SE.Project.Model;

import com.example.SE.Project.Model.PublicationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "publications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Publication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String journal;
    
    @Column(nullable = false)
    private String authors;
    
    @Column(nullable = false)
    private LocalDate date;
    
    @Column(unique = true)
    private String doi;
    
    @Column(nullable = false)
    private String type;
    
    @Column(nullable = false)
    private String status;
    
    private Double impactFactor;
    
    private String email;
}

