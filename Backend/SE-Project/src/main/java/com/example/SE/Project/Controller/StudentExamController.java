package com.example.SE.Project.Controller;

import com.example.SE.Project.Model.Exam;
import com.example.SE.Project.Model.ExamRequest;
import com.example.SE.Project.Model.Results;
import com.example.SE.Project.Model.Student;
import com.example.SE.Project.Service.ResultsService;
import com.example.SE.Project.Service.StudentExamService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/student/exams")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class StudentExamController {

    @Autowired
    private StudentExamService studentExamService;
    @Autowired
    private ResultsService ResultsService;
    // Endpoint to fetch all exam announcements
    @GetMapping("/announcements")
    public ResponseEntity<List<Exam>> getExamAnnouncements() {
        List<Exam> announcements = studentExamService.getExamAnnouncements();
        return ResponseEntity.ok(announcements);
    }

    // Endpoint to submit a new exam request
    @PostMapping("/request")
    public ResponseEntity<String> submitExamRequest(@RequestBody ExamRequest examRequest) {
        try {
            studentExamService.submitExamRequest(examRequest);
            return ResponseEntity.ok("Exam request submitted successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // Endpoint to fetch approved exam requests
    @GetMapping("/approved-requests")
    public ResponseEntity<List<ExamRequest>> getApprovedExamRequests() {
        List<ExamRequest> approvedRequests = studentExamService.getApprovedExamRequests();
        return ResponseEntity.ok(approvedRequests);
    }

    // Endpoint to fetch exam results
    @GetMapping("/results")
    public ResponseEntity<Optional<Results>> getExamResults(Principal principal) {
         String email = "";
    if(principal instanceof OAuth2AuthenticationToken) {
        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) principal;
        OAuth2User user = authToken.getPrincipal();
        email = user.getAttribute("email");
    } else {
        email = principal.getName();
    
    }
    
        Optional<Results> result = ResultsService.getResultsByRollNo(email); // ✅ Uses Optional<Results>
        
        
       
        return ResponseEntity.ok(result);
    }
   
}