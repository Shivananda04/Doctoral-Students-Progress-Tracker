package com.example.SE.Project;

import com.example.SE.Project.Model.Exam;
import com.example.SE.Project.Model.ExamRequest;
import com.example.SE.Project.Service.ExamManagementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import com.example.SE.Project.Controller.ExamManagementController;


import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ExamManagementControllerTest {

    @Mock
    private ExamManagementService examManagementService;

    @InjectMocks
    private ExamManagementController examManagementController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAnnounceExam_Success() {
        // Arrange
        Exam exam = new Exam();
        exam.setName("Final Exam");
        exam.setDate("2024-05-01");
        exam.setDeadline("2024-04-30");
        exam.setVenue("Room 101");
        exam.setDuration("3 hours");
        exam.setShift("Morning");

        doNothing().when(examManagementService).announceExam(exam);

        // Act
        ResponseEntity<String> response = examManagementController.announceExam(exam);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Exam announced successfully", response.getBody());
        verify(examManagementService, times(1)).announceExam(exam);
    }

    @Test
    void testAnnounceExam_Error() {
        // Arrange
        Exam exam = new Exam();
        doThrow(new RuntimeException("Database error")).when(examManagementService).announceExam(exam);

        // Act
        ResponseEntity<String> response = examManagementController.announceExam(exam);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error: Database error", response.getBody());
        verify(examManagementService, times(1)).announceExam(exam);
    }

    @Test
    void testGetApprovedExamRequests_Success() {
        // Arrange
        List<ExamRequest> approvedRequests = Arrays.asList(
            createExamRequest(1L, "John Doe", "Final Exam", "Approved"),
            createExamRequest(2L, "Jane Smith", "Midterm Exam", "Approved")
        );
        when(examManagementService.getApprovedExamRequests()).thenReturn(approvedRequests);

        // Act
        ResponseEntity<List<ExamRequest>> response = examManagementController.getApprovedExamRequests();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(approvedRequests, response.getBody());
        assertEquals(2, response.getBody().size());
        verify(examManagementService, times(1)).getApprovedExamRequests();
    }

    @Test
    void testUploadResults_Success() {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "results.xlsx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "test data".getBytes()
        );

        doNothing().when(examManagementService).uploadResults(file);

        // Act
        ResponseEntity<String> response = examManagementController.uploadResults(file);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Results uploaded successfully", response.getBody());
        verify(examManagementService, times(1)).uploadResults(file);
    }

    @Test
    void testUploadResults_Error() {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "results.xlsx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "test data".getBytes()
        );

        doThrow(new RuntimeException("Invalid file format"))
            .when(examManagementService).uploadResults(file);

        // Act
        ResponseEntity<String> response = examManagementController.uploadResults(file);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error: Invalid file format", response.getBody());
        verify(examManagementService, times(1)).uploadResults(file);
    }

    // Helper method to create ExamRequest objects
    private ExamRequest createExamRequest(Long id, String studentName, String examName, String status) {
        ExamRequest request = new ExamRequest();
        request.setId(id);
        request.setStudentName(studentName);
        request.setExamName(examName);
        request.setStatus(status);
        return request;
    }
}
