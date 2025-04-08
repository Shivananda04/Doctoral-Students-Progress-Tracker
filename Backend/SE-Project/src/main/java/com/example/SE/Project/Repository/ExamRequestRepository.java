package com.example.SE.Project.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.SE.Project.Model.ExamRequest;

@Repository
public interface ExamRequestRepository extends JpaRepository<ExamRequest, Long> {
    List<ExamRequest> findByStatus(String status);
}