package com.example.SE.Project.Model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Student extends User {
     
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String roll; 
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supervisor_id")
    private Supervisor supervisor;
    
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "student-meetings")
    private List<DCMeeting> meetings;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "student-enrollments")
    private List<Enrollment> enrollments;
  

    
    
    private String email;

    @Enumerated(EnumType.STRING)
    private UserRole userRole = UserRole.STUDENT;
}