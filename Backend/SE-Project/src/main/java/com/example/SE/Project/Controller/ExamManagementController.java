package com.example.SE.Project.Controller;

import com.example.SE.Project.Model.Exam;
import com.example.SE.Project.Model.ExamRequest;
import com.example.SE.Project.Service.ExamManagementService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ExamManagementController {

    @Autowired
    private ExamManagementService examManagementService;

    // Endpoint to announce a new exam
    @PostMapping("/announce")
    public ResponseEntity<String> announceExam(@RequestBody Exam exam) {
        try {
            examManagementService.announceExam(exam);
            return ResponseEntity.ok("Exam announced successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // Endpoint to fetch approved exam requests
    @GetMapping("/approved-requests")
    public ResponseEntity<List<ExamRequest>> getApprovedExamRequests() {
        List<ExamRequest> approvedRequests = examManagementService.getApprovedExamRequests();
        return ResponseEntity.ok(approvedRequests);
    }

    // Endpoint to upload results
    @PostMapping("/upload-results")
    public ResponseEntity<String> uploadResults(@RequestParam("file") MultipartFile file) {
        try {
            examManagementService.uploadResults(file);
            return ResponseEntity.ok("Results uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}