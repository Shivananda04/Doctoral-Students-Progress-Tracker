package com.example.SE.Project;

import com.example.SE.Project.Model.Exam;
import com.example.SE.Project.Model.ExamRequest;
import com.example.SE.Project.Model.Results;
import com.example.SE.Project.Service.ResultsService;
import com.example.SE.Project.Service.StudentExamService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import com.example.SE.Project.Controller.StudentExamController;



import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class StudentExamControllerTest {

    @Mock
    private StudentExamService studentExamService;

    @Mock
    private ResultsService resultsService;

    @InjectMocks
    private StudentExamController studentExamController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetExamAnnouncements() {
        // Arrange
        List<Exam> expectedAnnouncements = Arrays.asList(
            createExam(1L, "Final Exam", "2024-05-01", "Room 101"),
            createExam(2L, "Midterm Exam", "2024-03-15", "Room 102")
        );
        when(studentExamService.getExamAnnouncements()).thenReturn(expectedAnnouncements);

        // Act
        ResponseEntity<List<Exam>> response = studentExamController.getExamAnnouncements();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedAnnouncements, response.getBody());
        verify(studentExamService, times(1)).getExamAnnouncements();
    }

    @Test
    void testSubmitExamRequest_Success() {
        // Arrange
        ExamRequest examRequest = new ExamRequest();
        examRequest.setStudentName("John Doe");
        examRequest.setExamName("Final Exam");
        doNothing().when(studentExamService).submitExamRequest(examRequest);

        // Act
        ResponseEntity<String> response = studentExamController.submitExamRequest(examRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Exam request submitted successfully", response.getBody());
        verify(studentExamService, times(1)).submitExamRequest(examRequest);
    }

    @Test
    void testSubmitExamRequest_Error() {
        // Arrange
        ExamRequest examRequest = new ExamRequest();
        doThrow(new RuntimeException("Database error"))
            .when(studentExamService).submitExamRequest(examRequest);

        // Act
        ResponseEntity<String> response = studentExamController.submitExamRequest(examRequest);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error: Database error", response.getBody());
        verify(studentExamService, times(1)).submitExamRequest(examRequest);
    }

    @Test
    void testGetApprovedExamRequests() {
        // Arrange
        List<ExamRequest> expectedRequests = Arrays.asList(
            createExamRequest(1L, "John Doe", "Final Exam", "Approved"),
            createExamRequest(2L, "Jane Smith", "Midterm Exam", "Approved")
        );
        when(studentExamService.getApprovedExamRequests()).thenReturn(expectedRequests);

        // Act
        ResponseEntity<List<ExamRequest>> response = studentExamController.getApprovedExamRequests();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedRequests, response.getBody());
        verify(studentExamService, times(1)).getApprovedExamRequests();
    }

    @Test
    void testGetExamResults_WithOAuth2User() {
        // Arrange
        OAuth2AuthenticationToken authToken = mock(OAuth2AuthenticationToken.class);
        OAuth2User oauth2User = mock(OAuth2User.class);
        when(authToken.getPrincipal()).thenReturn(oauth2User);
        when(oauth2User.getAttribute("email")).thenReturn("student@example.com");

        Results expectedResult = new Results("P202300CS1", "John Doe", 85, 90);
        when(resultsService.getResultsByRollNo("student@example.com"))
            .thenReturn(Optional.of(expectedResult));

        // Act
        ResponseEntity<Optional<Results>> response = studentExamController.getExamResults(authToken);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Optional.of(expectedResult), response.getBody());
        verify(resultsService, times(1)).getResultsByRollNo("student@example.com");
    }

    // Helper methods
    private Exam createExam(Long id, String name, String date, String venue) {
        Exam exam = new Exam();
        exam.setId(id);
        exam.setName(name);
        exam.setDate(date);
        exam.setVenue(venue);
        exam.setDeadline("2024-04-30");
        exam.setDuration("3 hours");
        exam.setShift("Morning");
        return exam;
    }

    private ExamRequest createExamRequest(Long id, String studentName, String examName, String status) {
        ExamRequest request = new ExamRequest();
        request.setId(id);
        request.setStudentName(studentName);
        request.setExamName(examName);
        request.setStatus(status);
        return request;
    }
}
