package com.example.SE.Project.Controller;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.SE.Project.Model.Course;
import com.example.SE.Project.Model.Enrollment;
import com.example.SE.Project.Model.Student;
import com.example.SE.Project.Repository.CourseRepository;
import com.example.SE.Project.Repository.EnrollmentRepository;
import com.example.SE.Project.Repository.StudentRepository;

@RestController
@RequestMapping("/api/courses")
public class CourseveController {
    @Autowired
    private  CourseRepository courseRepository;
    @Autowired
    private  EnrollmentRepository enrollmentRepository;
    @Autowired
    private  StudentRepository studentRepository;

    @GetMapping("/available")
    public ResponseEntity<List<Course>> getAvailableCourses() {
        // Your logic here to fetch available courses
        return ResponseEntity.ok(courseRepository.findAll());
    }

    @GetMapping("/enrolled")
    public ResponseEntity<?> getEnrolledCourses(Principal principal) {
        String email = "";
    if(principal instanceof OAuth2AuthenticationToken) {
        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) principal;
        OAuth2User user = authToken.getPrincipal();
        email = user.getAttribute("email");
    } else {
        email = principal.getName();
    
    }
    
        try {
            Student student = studentRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            
            List<Enrollment> enrollments = enrollmentRepository.findByStudentId(student.getId());
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching enrollments: " + e.getMessage());
        }
    }

    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<?> enrollInCourse(
            @PathVariable String courseId,
            Principal principal){  
                if (principal == null) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You must be logged in to enroll in a course.");
                }
                String emails = "";
                if(principal instanceof OAuth2AuthenticationToken) {
                    OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) principal;
                    OAuth2User user = authToken.getPrincipal();
                    emails = user.getAttribute("email");
                } else {
                    emails = principal.getName();
                
                }

        try {
            Student student = studentRepository.findByEmail(emails)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            if (enrollmentRepository.existsByCourseIdAndStudentId(courseId, student.getId())) {
                return ResponseEntity.badRequest().body("Already enrolled in this course");
            }

            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found"));

            Enrollment enrollment = new Enrollment();
            enrollment.setCourseId(courseId);
            enrollment.setStudent(student);
            enrollment.setStatus("PENDING");
            enrollment.setEnrollmentDate(LocalDate.now());
            
            Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
            return ResponseEntity.ok(savedEnrollment);
            
        } catch (Exception e) {
            e.printStackTrace(); // or use a logger
            return ResponseEntity.internalServerError()
                .body("Enrollment failed: " + e.getMessage());
        }
    }
}