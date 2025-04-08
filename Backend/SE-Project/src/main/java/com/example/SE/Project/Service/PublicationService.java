package com.example.SE.Project.Service;

import com.example.SE.Project.Model.Publication;
import com.example.SE.Project.Model.PublicationStatus;
import com.example.SE.Project.Repository.PublicationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PublicationService {

    @Autowired
    private PublicationRepository publicationRepository;

    public List<Publication> getAllPublications() {
        return publicationRepository.findAll();
    }
    public List<Publication> findByStatus(PublicationStatus status) {
        return publicationRepository.findByStatus(status.name());
    }
    public Publication updatePublicationStatus(Long id, PublicationStatus status, String feedback) {
        Publication publication = publicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publication not found"));
        
        publication.setStatus(status.name());
        
        // Add feedback if provided (could be stored in a separate feedback table)
        if (feedback != null && !feedback.isEmpty()) {
            // Implementation depends on your feedback storage approach
        }
        
        return publicationRepository.save(publication);
    }
    public void deletePublication(Long id) {
        if (!publicationRepository.existsById(id)) {
            throw new RuntimeException("Publication not found");
        }
        publicationRepository.deleteById(id);
    }
    public Publication addPublication(Publication publication) {
        return publicationRepository.save(publication);
    }

    

    public Publication updatePublicationStatus(Long id, String status) {
        Optional<Publication> publicationOptional = publicationRepository.findById(id);
        if (publicationOptional.isPresent()) {
            Publication publication = publicationOptional.get();
            publication.setStatus(status);
            return publicationRepository.save(publication);
        }
        return null;
    }

    public List<Publication> searchPublications(String query) {
        return publicationRepository.findByTitleContainingIgnoreCaseOrJournalContainingIgnoreCaseOrAuthorsContainingIgnoreCase(
                query, query, query);
    }
}