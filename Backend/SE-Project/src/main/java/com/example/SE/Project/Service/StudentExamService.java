package com.example.SE.Project.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.SE.Project.Model.Exam;
import com.example.SE.Project.Model.ExamRequest;
import com.example.SE.Project.Model.Results;
import com.example.SE.Project.Repository.ExamRepository;
import com.example.SE.Project.Repository.ExamRequestRepository;
import com.example.SE.Project.Repository.ResultsRepository;

@Service
public class StudentExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ExamRequestRepository examRequestRepository;

    @Autowired
    private ResultsRepository examResultRepository;

    public List<Exam> getExamAnnouncements() {
        return examRepository.findAll(); // Fetch all exam announcements
    }

    public void submitExamRequest(ExamRequest examRequest) {
        examRequest.setStatus("Pending"); // Default status for new requests
        examRequestRepository.save(examRequest);
    }

    public List<ExamRequest> getApprovedExamRequests() {
        return examRequestRepository.findByStatus("Approved");
    }

    public List<Results> getExamResults() {
        return examResultRepository.findAll(); // Fetch all published exam results
    }
}