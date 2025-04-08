package com.example.SE.Project.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.SE.Project.Model.Coordinator;


public interface CoordinatorRepository extends JpaRepository<Coordinator, String>{
     @Query("SELECT c FROM Coordinator c WHERE c.email = ?1")
     Optional<Coordinator> findByEmail(String email);
    
    
}
