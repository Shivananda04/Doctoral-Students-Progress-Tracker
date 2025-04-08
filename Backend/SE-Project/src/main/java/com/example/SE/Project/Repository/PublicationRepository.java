package com.example.SE.Project.Repository;

import com.example.SE.Project.Model.Publication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, Long> {
    List<Publication> findByTitleContainingIgnoreCaseOrJournalContainingIgnoreCaseOrAuthorsContainingIgnoreCase(
        String title, String journal, String authors);
        List<Publication> findByStatus(String status);
}