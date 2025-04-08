package com.example.SE.Project.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.SE.Project.Model.Exam;
import com.example.SE.Project.Model.ExamRequest;
import com.example.SE.Project.Repository.ExamRepository;
import com.example.SE.Project.Repository.ExamRequestRepository;

@Service
public class ExamManagementService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ExamRequestRepository examRequestRepository;

    public void announceExam(Exam exam) {
        examRepository.save(exam);
    }

    public List<ExamRequest> getApprovedExamRequests() {
        return examRequestRepository.findByStatus("Approved");
    }

    public void uploadResults(MultipartFile file) {
        // Logic to process and save results from the uploaded Excel file
        // For example, parse the file and update the database with results
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        
    }
}