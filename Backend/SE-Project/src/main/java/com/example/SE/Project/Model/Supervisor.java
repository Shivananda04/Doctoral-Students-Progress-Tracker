package com.example.SE.Project.Model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "supervisors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Supervisor extends User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment primary key
    private Long id;
     private String name;
    private String email;
     @OneToMany(mappedBy = "supervisor", cascade = CascadeType.ALL, fetch = FetchType.LAZY) 
    @JsonManagedReference
    private List<Student> studentsUnderSupervision;
    
    @Enumerated(EnumType.STRING)
    private UserRole userRole =UserRole.SUPERVISOR ;
    public Supervisor(String name, String email) {
        this.name = name;
        this.email = email;
    }
    

}
