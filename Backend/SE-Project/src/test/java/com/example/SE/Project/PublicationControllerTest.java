package com.example.SE.Project;

import com.example.SE.Project.Model.Publication;
import com.example.SE.Project.Service.PublicationService;
import com.example.SE.Project.Controller.PublicationController;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class PublicationControllerTest {

    @Mock
    private PublicationService publicationService;

    @InjectMocks
    private PublicationController publicationController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllPublications() {
        // Arrange
        List<Publication> publications = Arrays.asList(
                new Publication(1L, "Title1", "Journal1", "Author1", LocalDate.now(), "DOI1", "Type1", "Submitted", 2.5, "email1@example.com"),
                new Publication(2L, "Title2", "Journal2", "Author2", LocalDate.now(), "DOI2", "Type2", "Published", 3.0, "email2@example.com")
        );
        when(publicationService.getAllPublications()).thenReturn(publications);

        // Act
        ResponseEntity<List<Publication>> response = publicationController.getAllPublications();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(publications, response.getBody());
    }

    @Test
    public void testAddPublication() {
        // Arrange
        Publication publication = new Publication(1L, "Title1", "Journal1", "Author1", LocalDate.now(), "DOI1", "Type1", "Submitted", 2.5, "email1@example.com");
        when(publicationService.addPublication(publication)).thenReturn(publication);

        // Act
        ResponseEntity<Publication> response = publicationController.addPublication(publication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(publication, response.getBody());
    }

    @Test
    public void testDeletePublication() {
        // Arrange
        Long publicationId = 1L;
        doNothing().when(publicationService).deletePublication(publicationId);

        // Act
        ResponseEntity<Void> response = publicationController.deletePublication(publicationId);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(publicationService, times(1)).deletePublication(publicationId);
    }

    @Test
    public void testUpdatePublicationStatus_Success() {
        // Arrange
        Long publicationId = 1L;
        String status = "Published";
        Publication updatedPublication = new Publication(1L, "Title1", "Journal1", "Author1", LocalDate.now(), "DOI1", "Type1", status, 2.5, "email1@example.com");
        when(publicationService.updatePublicationStatus(publicationId, status)).thenReturn(updatedPublication);

        // Act
        ResponseEntity<Publication> response = publicationController.updatePublicationStatus(publicationId, status);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedPublication, response.getBody());
    }

    @Test
    public void testUpdatePublicationStatus_NotFound() {
        // Arrange
        Long publicationId = 1L;
        String status = "Published";
        when(publicationService.updatePublicationStatus(publicationId, status)).thenReturn(null);

        // Act
        ResponseEntity<Publication> response = publicationController.updatePublicationStatus(publicationId, status);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testSearchPublications() {
        // Arrange
        String query = "Title";
        List<Publication> publications = Arrays.asList(
                new Publication(1L, "Title1", "Journal1", "Author1", LocalDate.now(), "DOI1", "Type1", "Submitted", 2.5, "email1@example.com"),
                new Publication(2L, "Title2", "Journal2", "Author2", LocalDate.now(), "DOI2", "Type2", "Published", 3.0, "email2@example.com")
        );
        when(publicationService.searchPublications(query)).thenReturn(publications);

        // Act
        ResponseEntity<List<Publication>> response = publicationController.searchPublications(query);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(publications, response.getBody());
    }
}
