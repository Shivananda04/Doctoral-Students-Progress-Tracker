package com.example.SE.Project.Repository;

import com.example.SE.Project.Model.Supervisor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SupervisorRepository extends JpaRepository<Supervisor, Long> {
    Optional<Supervisor> findByEmail(String email);
}