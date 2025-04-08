package com.example.SE.Project;

import com.example.SE.Project.Model.Publication;
import com.example.SE.Project.Service.PublicationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.example.SE.Project.Controller.SupervisorPublicationController;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SupervisorPublicationControllerTest {

    @Mock
    private PublicationService publicationService;

    @InjectMocks
    private SupervisorPublicationController supervisorPublicationController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllPublications() {
        // Arrange
        List<Publication> publications = Arrays.asList(
            new Publication(1L, "Research Paper 1", "Journal 1", "Author 1", 
                LocalDate.now(), "DOI1", "Type1", "SUBMITTED", 2.5, "author1@example.com"),
            new Publication(2L, "Research Paper 2", "Journal 2", "Author 2", 
                LocalDate.now(), "DOI2", "Type2", "SUBMITTED", 3.0, "author2@example.com")
        );
        when(publicationService.getAllPublications()).thenReturn(publications);

        // Act
        ResponseEntity<List<Publication>> response = supervisorPublicationController.getAllPublications();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(publications, response.getBody());
        verify(publicationService, times(1)).getAllPublications();
    }

    @Test
    void testUpdatePublicationStatus() {
        // Arrange
        Long id = 1L;
        Map<String, String> body = new HashMap<>();
        body.put("status", "ACCEPTED");

        Publication updatedPublication = new Publication(
            1L, "Research Paper 1", "Journal 1", "Author 1",
            LocalDate.now(), "DOI1", "Type1", "ACCEPTED", 2.5, "author1@example.com"
        );

        when(publicationService.updatePublicationStatus(id, "ACCEPTED")).thenReturn(updatedPublication);

        // Act
        ResponseEntity<Publication> response = supervisorPublicationController.updatePublicationStatus(id, body);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedPublication, response.getBody());
        verify(publicationService, times(1)).updatePublicationStatus(id, "ACCEPTED");
    }

    @Test
    void testDeletePublication() {
        // Arrange
        Long id = 1L;
        doNothing().when(publicationService).deletePublication(id);

        // Act
        ResponseEntity<Void> response = supervisorPublicationController.deletePublication(id);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(publicationService, times(1)).deletePublication(id);
    }

    @Test
    void testUpdatePublicationStatus_NotFound() {
        // Arrange
        Long id = 1L;
        Map<String, String> body = new HashMap<>();
        body.put("status", "ACCEPTED");

        when(publicationService.updatePublicationStatus(id, "ACCEPTED")).thenReturn(null);

        // Act
        ResponseEntity<Publication> response = supervisorPublicationController.updatePublicationStatus(id, body);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
    }
}