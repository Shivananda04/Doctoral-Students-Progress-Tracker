package com.example.SE.Project;

import com.example.SE.Project.Model.ExamRequest;
import com.example.SE.Project.Service.SupervisorExamManagementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.example.SE.Project.Controller.SupervisorExamManagementController;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class SupervisorExamManagementControllerTest {

    @Mock
    private SupervisorExamManagementService supervisorExamManagementService;

    @InjectMocks
    private SupervisorExamManagementController supervisorExamManagementController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetPendingExamRequests_Success() {
        // Arrange
        List<ExamRequest> expectedRequests = Arrays.asList(
            createExamRequest(1L, "John Doe", "Final Exam", "Pending"),
            createExamRequest(2L, "Jane Smith", "Midterm Exam", "Pending")
        );
        when(supervisorExamManagementService.getPendingExamRequests()).thenReturn(expectedRequests);

        // Act
        ResponseEntity<List<ExamRequest>> response = supervisorExamManagementController.getPendingExamRequests();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedRequests, response.getBody());
        verify(supervisorExamManagementService, times(1)).getPendingExamRequests();
    }

    @Test
    void testApproveExamRequest_Success() {
        // Arrange
        Long requestId = 1L;
        doNothing().when(supervisorExamManagementService).approveExamRequest(requestId);

        // Act
        ResponseEntity<String> response = supervisorExamManagementController.approveExamRequest(requestId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Exam request approved successfully", response.getBody());
        verify(supervisorExamManagementService, times(1)).approveExamRequest(requestId);
    }

    @Test
    void testApproveExamRequest_Error() {
        // Arrange
        Long requestId = 1L;
        doThrow(new RuntimeException("Request not found"))
            .when(supervisorExamManagementService).approveExamRequest(requestId);

        // Act
        ResponseEntity<String> response = supervisorExamManagementController.approveExamRequest(requestId);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error: Request not found", response.getBody());
        verify(supervisorExamManagementService, times(1)).approveExamRequest(requestId);
    }

    @Test
    void testRejectExamRequest_Success() {
        // Arrange
        Long requestId = 1L;
        doNothing().when(supervisorExamManagementService).rejectExamRequest(requestId);

        // Act
        ResponseEntity<String> response = supervisorExamManagementController.rejectExamRequest(requestId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Exam request rejected successfully", response.getBody());
        verify(supervisorExamManagementService, times(1)).rejectExamRequest(requestId);
    }

    @Test
    void testRejectExamRequest_Error() {
        // Arrange
        Long requestId = 1L;
        doThrow(new RuntimeException("Request not found"))
            .when(supervisorExamManagementService).rejectExamRequest(requestId);

        // Act
        ResponseEntity<String> response = supervisorExamManagementController.rejectExamRequest(requestId);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error: Request not found", response.getBody());
        verify(supervisorExamManagementService, times(1)).rejectExamRequest(requestId);
    }

    @Test
    void testGetApprovedExamRequests_Success() {
        // Arrange
        List<ExamRequest> expectedRequests = Arrays.asList(
            createExamRequest(1L, "John Doe", "Final Exam", "Approved"),
            createExamRequest(2L, "Jane Smith", "Midterm Exam", "Approved")
        );
        when(supervisorExamManagementService.getApprovedExamRequests()).thenReturn(expectedRequests);

        // Act
        ResponseEntity<List<ExamRequest>> response = supervisorExamManagementController.getApprovedExamRequests();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedRequests, response.getBody());
        verify(supervisorExamManagementService, times(1)).getApprovedExamRequests();
    }

    // Helper method to create test ExamRequest objects
    private ExamRequest createExamRequest(Long id, String studentName, String examName, String status) {
        ExamRequest request = new ExamRequest();
        request.setId(id);
        request.setStudentName(studentName);
        request.setExamName(examName);
        request.setStatus(status);
        return request;
    }
}