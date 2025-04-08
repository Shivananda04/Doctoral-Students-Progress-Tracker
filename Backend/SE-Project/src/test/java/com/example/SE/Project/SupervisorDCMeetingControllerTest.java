package com.example.SE.Project;

import com.example.SE.Project.Model.DCMeeting;
import com.example.SE.Project.Model.MeetingStatus;
import com.example.SE.Project.Model.Student;
import com.example.SE.Project.Model.Supervisor;
import com.example.SE.Project.Repository.DCMeetingRepository;
import com.example.SE.Project.Repository.StudentRepository;
import com.example.SE.Project.Repository.SupervisorRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import com.example.SE.Project.Controller.SupervisorDCMeetingController;

// import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class SupervisorDCMeetingControllerTest {

    @Mock
    private DCMeetingRepository dcMeetingRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private SupervisorRepository supervisorRepository;

    @InjectMocks
    private SupervisorDCMeetingController supervisorDCMeetingController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetPendingMeetings() {
        // Arrange
        OAuth2AuthenticationToken authToken = mock(OAuth2AuthenticationToken.class);
        OAuth2User oauth2User = mock(OAuth2User.class);
        when(authToken.getPrincipal()).thenReturn(oauth2User);
        when(oauth2User.getAttribute("email")).thenReturn("supervisor@test.com");

        Supervisor supervisor = new Supervisor();
        supervisor.setId(1L);
        supervisor.setEmail("supervisor@test.com");

        Student student1 = new Student();
        student1.setId(1L);
        student1.setSupervisor(supervisor);

        List<Student> students = Arrays.asList(student1);
        List<Long> studentIds = Arrays.asList(1L);

        DCMeeting meeting1 = new DCMeeting();
        meeting1.setId(1L);
        meeting1.setStudent(student1);
        meeting1.setStatus(MeetingStatus.SUBMITTED);

        when(supervisorRepository.findByEmail("supervisor@test.com")).thenReturn(Optional.of(supervisor));
        when(studentRepository.findBySupervisor(supervisor)).thenReturn(students);
        when(dcMeetingRepository.findByStudentIdIn(studentIds)).thenReturn(Arrays.asList(meeting1));

        // Act
        ResponseEntity<List<DCMeeting>> response = supervisorDCMeetingController.getPendingMeetings(authToken);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals(meeting1, response.getBody().get(0));
    }

    @Test
    void testApproveMeeting_Success() {
        // Arrange
        Long meetingId = 1L;
        OAuth2AuthenticationToken authToken = mock(OAuth2AuthenticationToken.class);
        OAuth2User oauth2User = mock(OAuth2User.class);
        when(authToken.getPrincipal()).thenReturn(oauth2User);
        when(oauth2User.getAttribute("email")).thenReturn("supervisor@test.com");

        Supervisor supervisor = new Supervisor();
        supervisor.setId(1L);
        supervisor.setEmail("supervisor@test.com");

        Student student = new Student();
        student.setSupervisor(supervisor);

        DCMeeting meeting = new DCMeeting();
        meeting.setId(meetingId);
        meeting.setStudent(student);
        meeting.setStatus(MeetingStatus.SUBMITTED);

        when(dcMeetingRepository.findById(meetingId)).thenReturn(Optional.of(meeting));
        when(supervisorRepository.findByEmail("supervisor@test.com")).thenReturn(Optional.of(supervisor));
        when(dcMeetingRepository.save(any(DCMeeting.class))).thenReturn(meeting);

        // Act
        ResponseEntity<DCMeeting> response = supervisorDCMeetingController.approveMeeting(meetingId, authToken);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(MeetingStatus.APPROVED, response.getBody().getStatus());
        verify(dcMeetingRepository).save(any(DCMeeting.class));
    }

    @Test
    void testRejectMeeting_Success() {
        // Arrange
        Long meetingId = 1L;
        OAuth2AuthenticationToken authToken = mock(OAuth2AuthenticationToken.class);
        OAuth2User oauth2User = mock(OAuth2User.class);
        when(authToken.getPrincipal()).thenReturn(oauth2User);
        when(oauth2User.getAttribute("email")).thenReturn("supervisor@test.com");

        Supervisor supervisor = new Supervisor();
        supervisor.setId(1L);
        supervisor.setEmail("supervisor@test.com");

        Student student = new Student();
        student.setSupervisor(supervisor);

        DCMeeting meeting = new DCMeeting();
        meeting.setId(meetingId);
        meeting.setStudent(student);
        meeting.setStatus(MeetingStatus.SUBMITTED);

        Map<String, String> request = new HashMap<>();
        request.put("comments", "Needs revision");

        when(dcMeetingRepository.findById(meetingId)).thenReturn(Optional.of(meeting));
        when(supervisorRepository.findByEmail("supervisor@test.com")).thenReturn(Optional.of(supervisor));
        when(dcMeetingRepository.save(any(DCMeeting.class))).thenReturn(meeting);

        // Act
        ResponseEntity<DCMeeting> response = supervisorDCMeetingController.rejectMeeting(meetingId, request, authToken);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(MeetingStatus.REJECTED, response.getBody().getStatus());
        assertEquals("Needs revision", response.getBody().getComments());
        verify(dcMeetingRepository).save(any(DCMeeting.class));
    }

    @Test
    void testRejectMeeting_NoComments() {
        // Arrange
        Long meetingId = 1L;
        Map<String, String> request = new HashMap<>(); // Empty comments
        OAuth2AuthenticationToken authToken = mock(OAuth2AuthenticationToken.class);
        OAuth2User oauth2User = mock(OAuth2User.class);
        when(authToken.getPrincipal()).thenReturn(oauth2User);
        when(oauth2User.getAttribute("email")).thenReturn("supervisor@test.com");

        Supervisor supervisor = new Supervisor();
        supervisor.setEmail("supervisor@test.com");

        Student student = new Student();
        student.setSupervisor(supervisor);

        DCMeeting meeting = new DCMeeting();
        meeting.setStudent(student);

        when(dcMeetingRepository.findById(meetingId)).thenReturn(Optional.of(meeting));
        when(supervisorRepository.findByEmail("supervisor@test.com")).thenReturn(Optional.of(supervisor));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            supervisorDCMeetingController.rejectMeeting(meetingId, request, authToken);
        });
        assertEquals("Comments are required for rejection", exception.getMessage());
    }
}