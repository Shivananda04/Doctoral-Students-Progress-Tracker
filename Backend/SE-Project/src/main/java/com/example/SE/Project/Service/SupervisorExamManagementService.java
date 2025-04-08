package com.example.SE.Project.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.SE.Project.Model.ExamRequest;
import com.example.SE.Project.Repository.ExamRequestRepository;

@Service
public class SupervisorExamManagementService {

    @Autowired
    private ExamRequestRepository examRequestRepository;

    public List<ExamRequest> getPendingExamRequests() {
        return examRequestRepository.findByStatus("Pending");
    }

    public void approveExamRequest(Long requestId) {
        ExamRequest request = examRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Exam request not found"));
        request.setStatus("Approved");
        examRequestRepository.save(request);
    }

    public void rejectExamRequest(Long requestId) {
        ExamRequest request = examRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Exam request not found"));
        request.setStatus("Rejected");
        examRequestRepository.save(request);
    }

    public List<ExamRequest> getApprovedExamRequests() {
        return examRequestRepository.findByStatus("Approved");
    }
}