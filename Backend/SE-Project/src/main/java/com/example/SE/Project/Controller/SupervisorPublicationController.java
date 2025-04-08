package com.example.SE.Project.Controller;

import com.example.SE.Project.Model.Publication;
import com.example.SE.Project.Model.PublicationStatus;
import com.example.SE.Project.Service.PublicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/publicationss")
public class SupervisorPublicationController {

    private final PublicationService publicationService;

    public SupervisorPublicationController(PublicationService publicationService) {
        this.publicationService = publicationService;
    }

    // Get all publications awaiting approval (status = Submitted)
    @GetMapping
    public ResponseEntity<List<Publication>> getAllPublications() {
        List<Publication> allPublications = publicationService.getAllPublications();
        return ResponseEntity.ok(allPublications);
    }

    // Update publication status (Approve/Reject)
    @PutMapping("/{id}/status")
public ResponseEntity<Publication> updatePublicationStatus(
        @PathVariable Long id,
        @RequestBody Map<String, String> body) {

    String status = body.get("status"); // extract the status from the JSON body

    Publication updatedPublication = publicationService.updatePublicationStatus(id, status);

    if (updatedPublication != null) {
        return ResponseEntity.ok(updatedPublication);
    } else {
        return ResponseEntity.notFound().build(); // or appropriate error handling
    }
}

    // Delete a publication
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePublication(@PathVariable Long id) {
        publicationService.deletePublication(id);
        return ResponseEntity.noContent().build();
    }

    // DTO for status update request
    public static class StatusUpdateRequest {
        private PublicationStatus status;
        private String feedback;

        // Getters and setters
        public PublicationStatus getStatus() {
            return status;
        }

        public void setStatus(PublicationStatus status) {
            this.status = status;
        }

        public String getFeedback() {
            return feedback;
        }

        public void setFeedback(String feedback) {
            this.feedback = feedback;
        }
    }
}