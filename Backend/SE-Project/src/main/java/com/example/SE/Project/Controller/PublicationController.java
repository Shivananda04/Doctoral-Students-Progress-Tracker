package com.example.SE.Project.Controller;

import com.example.SE.Project.Model.Publication;
import com.example.SE.Project.Service.PublicationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publications")
@CrossOrigin(origins = "http://localhost:3000")
public class PublicationController {

    @Autowired
    private PublicationService publicationService;

    @GetMapping
    public ResponseEntity<List<Publication>> getAllPublications() {
        return ResponseEntity.ok(publicationService.getAllPublications());
    }

    @PostMapping
    public ResponseEntity<Publication> addPublication(@RequestBody Publication publication) {
        return ResponseEntity.ok(publicationService.addPublication(publication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePublication(@PathVariable Long id) {
        publicationService.deletePublication(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Publication> updatePublicationStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Publication updatedPublication = publicationService.updatePublicationStatus(id, status);
        if (updatedPublication != null) {
            return ResponseEntity.ok(updatedPublication);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Publication>> searchPublications(@RequestParam String query) {
        return ResponseEntity.ok(publicationService.searchPublications(query));
    }
}