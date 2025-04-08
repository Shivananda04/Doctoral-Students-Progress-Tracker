package com.example.SE.Project.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.SE.Project.Model.Student;
import com.example.SE.Project.Model.Supervisor;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email); // Find a student by their email address

    public List<Student> findBySupervisor(Supervisor supervisor);
      // Search by name or email
List<Student> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email);

}
