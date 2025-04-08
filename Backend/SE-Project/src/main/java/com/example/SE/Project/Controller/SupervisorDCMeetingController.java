package com.example.SE.Project.Controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.SE.Project.Model.DCMeeting;
import com.example.SE.Project.Model.MeetingStatus;
import com.example.SE.Project.Model.Student;
import com.example.SE.Project.Model.Supervisor;
import com.example.SE.Project.Repository.DCMeetingRepository;
import com.example.SE.Project.Repository.StudentRepository;
import com.example.SE.Project.Repository.SupervisorRepository;

@RestController
@RequestMapping("/api/supervisor/dc-meetings")
@CrossOrigin(origins="http://localhost:5173")
public class SupervisorDCMeetingController {

    @Autowired
    private DCMeetingRepository dcMeetingRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private SupervisorRepository supervisorRepository;

   @GetMapping
public ResponseEntity<List<DCMeeting>> getPendingMeetings(Principal principal) {
   
    String email = "";
    if(principal instanceof OAuth2AuthenticationToken) {
        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) principal;
        OAuth2User user = authToken.getPrincipal();
        email = user.getAttribute("email");
    } else {
        email = principal.getName();
    
    }
    System.out.println("Email: "+email);
    // Get supervisor by email
    Supervisor supervisor = supervisorRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Supervisor not found"));

    // Get all student IDs under this supervisor
    List<Long> studentIds = studentRepository.findBySupervisor(supervisor)
            .stream()
            .map(Student::getId)
            .collect(Collectors.toList());

    // Get all submitted meetings from these student IDs
    
    List<DCMeeting> meetings = dcMeetingRepository.findByStudentIdIn(studentIds);


    return ResponseEntity.ok(meetings);
}


    @PutMapping("/{meetingId}/approve")
    public ResponseEntity<DCMeeting> approveMeeting(
            @PathVariable Long meetingId,
            Principal principal) {
            
                String email = "";
                if (principal instanceof OAuth2AuthenticationToken) {
                    OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) principal;
                    OAuth2User user = authToken.getPrincipal();
                    email = user.getAttribute("email");
                } else {
                    email = principal.getName();
                
                }
            System.out.println("Email"+email);
        DCMeeting meeting = dcMeetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        
        // Verify the supervisor is authorized to approve this meeting
        Supervisor supervisor = supervisorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Supervisor not found"));
        
        if (!meeting.getStudent().getSupervisor().equals(supervisor)) {
            throw new RuntimeException("Unauthorized to approve this meeting");
        }
        
        meeting.setStatus(MeetingStatus.APPROVED);
        System.out.println("Meeting status updated to APPROVED");
        meeting.setComments(null);
        DCMeeting updatedMeeting = dcMeetingRepository.save(meeting);
        
        return ResponseEntity.ok(updatedMeeting);
    }

    @PutMapping("/{meetingId}/reject")

    public ResponseEntity<DCMeeting> rejectMeeting(
            @PathVariable Long meetingId,
            @RequestBody Map<String, String> request,
            Principal principal) {
                String email = "";
                if (principal instanceof OAuth2AuthenticationToken) {
                    OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) principal;
                    OAuth2User user = authToken.getPrincipal();
                    email = user.getAttribute("email");
                } else {
                    email = principal.getName();
                
                }
        DCMeeting meeting = dcMeetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        
        // Verify the supervisor is authorized to reject this meeting
        Supervisor supervisor = supervisorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Supervisor not found"));
        
        if (!meeting.getStudent().getSupervisor().equals(supervisor)) {
            throw new RuntimeException("Unauthorized to reject this meeting");
        }
        
        String comments = request.get("comments");
        if (comments == null || comments.trim().isEmpty()) {
            throw new RuntimeException("Comments are required for rejection");
        }
        
        meeting.setStatus(MeetingStatus.REJECTED);
        meeting.setComments(comments);
        DCMeeting updatedMeeting = dcMeetingRepository.save(meeting);
        
        return ResponseEntity.ok(updatedMeeting);
    }
}