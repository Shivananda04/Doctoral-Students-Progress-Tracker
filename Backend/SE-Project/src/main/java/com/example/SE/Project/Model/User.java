package com.example.SE.Project.Model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    public UserRole getUserRole() {
        return userRole;
    }
}
