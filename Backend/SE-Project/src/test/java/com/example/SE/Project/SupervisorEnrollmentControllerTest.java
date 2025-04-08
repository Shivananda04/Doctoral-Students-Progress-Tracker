package com.example.SE.Project;

import com.example.SE.Project.Model.Enrollment;
import com.example.SE.Project.Model.Supervisor;
import com.example.SE.Project.Model.Student;
import com.example.SE.Project.Repository.EnrollmentRepository;
import com.example.SE.Project.Repository.SupervisorRepository;
import com.example.SE.Project.Service.SupervisorEnrollmentService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import com.example.SE.Project.Controller.SupervisorEnrollmentController;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SupervisorEnrollmentControllerTest {

    @Mock
    private SupervisorEnrollmentService enrollmentService;

    @Mock
    private SupervisorRepository supervisorRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @InjectMocks
    private SupervisorEnrollmentController supervisorEnrollmentController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetPendingEnrollments_Success() {
        // Arrange
        OAuth2AuthenticationToken authentication = mock(OAuth2AuthenticationToken.class);
        OAuth2User oauth2User = mock(OAuth2User.class);
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("email", "supervisor@test.com");

        when(authentication.getPrincipal()).thenReturn(oauth2User);
        when(oauth2User.getAttributes()).thenReturn(attributes);

        Supervisor supervisor = new Supervisor();
        supervisor.setId(1L);
        supervisor.setEmail("supervisor@test.com");

        List<Enrollment> pendingEnrollments = Arrays.asList(
            createEnrollment(1L, "CSE101", "PENDING"),
            createEnrollment(2L, "CSE102", "PENDING")
        );

        when(supervisorRepository.findByEmail("supervisor@test.com")).thenReturn(Optional.of(supervisor));
        when(enrollmentService.getPendingEnrollments(supervisor.getId())).thenReturn(pendingEnrollments);

        // Act
        ResponseEntity<?> response = supervisorEnrollmentController.getPendingEnrollments(authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(pendingEnrollments, response.getBody());
    }

    @Test
    void testGetPendingEnrollments_Unauthorized() {
        // Arrange
        OAuth2AuthenticationToken authentication = mock(OAuth2AuthenticationToken.class);
        when(authentication.getPrincipal()).thenReturn(null);

        // Act
        ResponseEntity<?> response = supervisorEnrollmentController.getPendingEnrollments(authentication);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Authentication token is missing.", response.getBody());
    }

    @Test
    void testApproveEnrollment_Success() {
        // Arrange
        Long enrollmentId = 1L;
        Enrollment enrollment = new Enrollment();
        enrollment.setId(enrollmentId);
        enrollment.setStatus("PENDING");

        when(enrollmentRepository.findById(enrollmentId)).thenReturn(Optional.of(enrollment));
        when(enrollmentRepository.save(any(Enrollment.class))).thenReturn(enrollment);

        // Act
        supervisorEnrollmentController.approveEnrollment(enrollmentId);

        // Assert
        verify(enrollmentRepository).findById(enrollmentId);
        verify(enrollmentRepository).save(enrollment);
        assertEquals("APPROVED", enrollment.getStatus());
    }

    @Test
    void testApproveEnrollment_NotFound() {
        // Arrange
        Long enrollmentId = 1L;
        when(enrollmentRepository.findById(enrollmentId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            supervisorEnrollmentController.approveEnrollment(enrollmentId);
        });
    }

    @Test
    void testRejectEnrollment_Success() {
        // Arrange
        Long enrollmentId = 1L;
        doNothing().when(enrollmentService).rejectEnrollment(enrollmentId);

        // Act
        ResponseEntity<?> response = supervisorEnrollmentController.rejectEnrollment(enrollmentId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(enrollmentService, times(1)).rejectEnrollment(enrollmentId);
    }

    // Helper method to create test Enrollment objects
    private Enrollment createEnrollment(Long id, String courseId, String status) {
        Enrollment enrollment = new Enrollment();
        enrollment.setId(id);
        enrollment.setCourseId(courseId);
        enrollment.setStatus(status);
        enrollment.setEnrollmentDate(LocalDate.now());
        return enrollment;
    }
}
