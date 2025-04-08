package com.example.SE.Project.Controller;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.example.SE.Project.Model.DCMeeting;
import com.example.SE.Project.Service.DCMeetingService;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/dc-meetings")
public class DCMeetingController {

    private final DCMeetingService meetingService;

    
    public DCMeetingController(DCMeetingService meetingService) {
        this.meetingService = meetingService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<DCMeeting>> getAllMeetings() {
        System.out.println("Fetching all meetings...");
        return ResponseEntity.ok(meetingService.getAllMeetings());
    }


    @PostMapping(value = "/do", consumes = "multipart/form-data")
    public ResponseEntity<?> createMeeting(
            @RequestParam("date") String date,
            @RequestParam("summary") String summary,
            @RequestParam("file") MultipartFile file,
            Principal principal) {
        try {
            if(principal==null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }
            String emails="";
            if (principal instanceof OAuth2AuthenticationToken) {
                OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) principal;
                OAuth2User user = authToken.getPrincipal();
               emails = user.getAttribute("email");
                
            }
        

           

            // Convert date to LocalDate
            LocalDate meetingDate = LocalDate.parse(date);

            // Process meeting
            DCMeeting meeting = meetingService.createMeeting(meetingDate, summary, file, emails);
            return ResponseEntity.ok(meeting);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing request: " + e.getMessage());
        }
    }

    @GetMapping("/download/{meetingId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long meetingId, HttpServletRequest request) {
        try {
            Resource resource = meetingService.downloadFile(meetingId);

            // Determine file type
            String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
}
