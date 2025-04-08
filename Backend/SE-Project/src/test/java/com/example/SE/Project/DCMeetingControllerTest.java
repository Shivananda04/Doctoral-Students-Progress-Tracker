package com.example.SE.Project;

import com.example.SE.Project.Controller.DCMeetingController;
import com.example.SE.Project.Model.DCMeeting;
import com.example.SE.Project.Service.DCMeetingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import jakarta.servlet.http.HttpServletRequest;

// import java.io.IOException;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class DCMeetingControllerTest {

    @Mock
    private DCMeetingService meetingService;

    @InjectMocks
    private DCMeetingController meetingController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateMeeting_Success() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile("file", "meeting.pdf", "application/pdf", "dummy content".getBytes());
        String date = "2025-04-08";
        String summary = "Meeting Summary";
        String email = "student@example.com";

        DCMeeting meeting = new DCMeeting();
        meeting.setId(1L);
        meeting.setDate(LocalDate.parse(date));
        meeting.setSummary(summary);
        meeting.setFilename(file.getOriginalFilename());
        meeting.setFilepath("uploads/meeting.pdf");

        when(meetingService.createMeeting(LocalDate.parse(date), summary, file, email)).thenReturn(meeting);

        // Act
        ResponseEntity<?> response = meetingController.createMeeting(date, summary, file, () -> email);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        // assertEquals(meeting, response.getBody());
    }

    @Test
    public void testCreateMeeting_Unauthenticated() {
        // Arrange
        MockMultipartFile file = new MockMultipartFile("file", "meeting.pdf", "application/pdf", "dummy content".getBytes());
        String date = "2025-04-08";
        String summary = "Meeting Summary";

        // Act
        ResponseEntity<?> response = meetingController.createMeeting(date, summary, file, null);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("User not authenticated", response.getBody());
    }

    
    @Test
    public void testDownloadFile_Success() throws Exception {
    // Arrange
    Long meetingId = 1L;
    Resource resource = mock(Resource.class);
    // Declare and initialize the request variable
    HttpServletRequest request = mock(HttpServletRequest.class);
    jakarta.servlet.ServletContext servletContext = mock(jakarta.servlet.ServletContext.class);

    // Mock the behavior of the resource and request
    when(meetingService.downloadFile(meetingId)).thenReturn(resource);
    when(resource.getFile()).thenReturn(new java.io.File("meeting.pdf"));
    when(resource.getFilename()).thenReturn("meeting.pdf");
    when(request.getServletContext()).thenReturn(servletContext);
    when(servletContext.getMimeType("meeting.pdf")).thenReturn("application/pdf");

    // Act
    ResponseEntity<Resource> response = meetingController.downloadFile(meetingId, request);

    // Assert
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(resource, response.getBody());
    // assertEquals("application/pdf", response.getHeaders().getContentType().toString());
    assertEquals("attachment; filename=\"meeting.pdf\"", response.getHeaders().getFirst("Content-Disposition"));
}
    
    // @Test
    // public void testDownloadFile_NotFound() throws Exception {
    //     // Arrange
    //     Long meetingId = 1L;
    //     HttpServletRequest request = mock(HttpServletRequest.class);

    //     // when(meetingService.downloadFile(meetingId)).thenThrow(new RuntimeException("File not found"));
    //     doThrow(new RuntimeException("File not found")).when(meetingService).downloadFile(meetingId);
    //     // Act
    //     ResponseEntity<Resource> response = meetingController.downloadFile(meetingId, request);

    //     // Assert
    //     assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    //     assertEquals(null, response.getBody());
    // }
}
