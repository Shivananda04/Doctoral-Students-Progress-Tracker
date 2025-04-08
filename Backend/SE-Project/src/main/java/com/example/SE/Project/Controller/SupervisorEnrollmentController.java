package com.example.SE.Project.Controller;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.SE.Project.Model.Enrollment;
import com.example.SE.Project.Model.Supervisor;
import com.example.SE.Project.Repository.EnrollmentRepository;
import com.example.SE.Project.Repository.SupervisorRepository;
import com.example.SE.Project.Service.SupervisorEnrollmentService;

@RestController
@RequestMapping("/api/supervisor/enrollments")
public class SupervisorEnrollmentController {

    @Autowired
    private SupervisorEnrollmentService enrollmentService;
     @Autowired
    private SupervisorRepository supervisorRepository;
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    @GetMapping("/pending")
public ResponseEntity<?> getPendingEnrollments(OAuth2AuthenticationToken authentication) {
    if (authentication == null || authentication.getPrincipal() == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication token is missing.");
    }

    Map<String, Object> attributes = authentication.getPrincipal().getAttributes();
    System.out.println("OAuth2 attributes: " + attributes);

    String email = (String) attributes.get("email");
    if (email == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email not found in token.");
    }

    Supervisor supervisor = supervisorRepository.findByEmail(email).orElse(null);
    if (supervisor == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Supervisor not found.");
    }

    List<Enrollment> pendingEnrollments = enrollmentService.getPendingEnrollments(supervisor.getId());
    return ResponseEntity.ok(pendingEnrollments);
}

@PostMapping("/{enrollmentId}/approve")
public void approveEnrollment(@PathVariable Long enrollmentId) {
    Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
        .orElseThrow(() -> new IllegalArgumentException("Enrollment not found"));

    enrollment.setStatus("APPROVED");
    enrollmentRepository.save(enrollment);
}

    @PostMapping("/{enrollmentId}/reject")
    public ResponseEntity<?> rejectEnrollment(
            @PathVariable Long enrollmentId) {
        enrollmentService.rejectEnrollment(enrollmentId);
        return ResponseEntity.ok().build();
    }
}