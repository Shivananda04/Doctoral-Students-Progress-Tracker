package com.example.SE.Project.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.SE.Project.Model.Exam;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
}