package com.example.SE.Project.Model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Entity
@Table(name = "coordinators")
@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor
public class Coordinator extends User {
    private String name;
    @Id
    @Column(name = "email")
    private String email;
    

    @Column(name = "user_role")
    @Enumerated(EnumType.STRING)
    private UserRole userRole=UserRole.COORDINATOR;
}
