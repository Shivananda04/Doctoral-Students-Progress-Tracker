package com.example.SE.Project.Controller;

import com.example.SE.Project.Model.ExamRequest;
import com.example.SE.Project.Service.SupervisorExamManagementService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supervisor/exams")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class SupervisorExamManagementController {

    @Autowired
    private SupervisorExamManagementService supervisorExamManagementService;

    // Endpoint to fetch all pending exam requests
    @GetMapping("/requests")
    public ResponseEntity<List<ExamRequest>> getPendingExamRequests() {
        List<ExamRequest> pendingRequests = supervisorExamManagementService.getPendingExamRequests();
        return ResponseEntity.ok(pendingRequests);
    }

    // Endpoint to approve an exam request
    @PostMapping("/{requestId}/approve")
    public ResponseEntity<String> approveExamRequest(@PathVariable Long requestId) {
        try {
            supervisorExamManagementService.approveExamRequest(requestId);
            return ResponseEntity.ok("Exam request approved successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // Endpoint to reject an exam request
    @PostMapping("/{requestId}/reject")
    public ResponseEntity<String> rejectExamRequest(@PathVariable Long requestId) {
        try {
            supervisorExamManagementService.rejectExamRequest(requestId);
            return ResponseEntity.ok("Exam request rejected successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // Endpoint to fetch all approved exam requests
    @GetMapping("/approved")
    public ResponseEntity<List<ExamRequest>> getApprovedExamRequests() {
        List<ExamRequest> approvedRequests = supervisorExamManagementService.getApprovedExamRequests();
        return ResponseEntity.ok(approvedRequests);
    }
}