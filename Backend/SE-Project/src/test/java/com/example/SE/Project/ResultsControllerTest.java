package com.example.SE.Project;

import com.example.SE.Project.Model.Results;
import com.example.SE.Project.Service.ResultsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import com.example.SE.Project.Controller.ResultsController;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ResultsControllerTest {

    @Mock
    private ResultsService resultsService;

    @InjectMocks
    private ResultsController resultsController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testUploadFile_Success() {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "results.xlsx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "test data".getBytes()
        );

        List<Results> savedResults = Arrays.asList(
            new Results("P202300CS1", "Student 1", 85, 90),
            new Results("P202300CS2", "Student 2", 75, 80)
        );

        when(resultsService.saveResultssFromExcel(file)).thenReturn(savedResults);

        // Act
        ResponseEntity<?> response = resultsController.uploadFile(file);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(savedResults, response.getBody());
        verify(resultsService, times(1)).saveResultssFromExcel(file);
    }

    @Test
    void testUploadFile_EmptyFile() {
        // Arrange
        MockMultipartFile emptyFile = new MockMultipartFile(
            "file",
            "empty.xlsx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            new byte[0]
        );

        // Act
        ResponseEntity<?> response = resultsController.uploadFile(emptyFile);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("File is empty. Please upload a valid Excel file.", response.getBody());
        verify(resultsService, never()).saveResultssFromExcel(any());
    }

    @Test
    void testGetAllResults_Success() {
        // Arrange
        List<Results> allResults = Arrays.asList(
            new Results("P202300CS1", "Student 1", 85, 90),
            new Results("P202300CS2", "Student 2", 75, 80)
        );

        when(resultsService.getAllResultss()).thenReturn(allResults);

        // Act
        ResponseEntity<?> response = resultsController.getAllResultss();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(allResults, response.getBody());
        verify(resultsService, times(1)).getAllResultss();
    }

    @Test
    void testGetAllResults_EmptyList() {
        // Arrange
        when(resultsService.getAllResultss()).thenReturn(Arrays.asList());

        // Act
        ResponseEntity<?> response = resultsController.getAllResultss();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("No Resultss available.", response.getBody());
        verify(resultsService, times(1)).getAllResultss();
    }

    @Test
    void testGetResultsByRollNo_Success() {
        // Arrange
        String rollNo = "P202300CS1";
        Results result = new Results(rollNo, "Student 1", 85, 90);
        
        when(resultsService.getResultsByRollNo(rollNo)).thenReturn(Optional.of(result));

        // Act
        ResponseEntity<?> response = resultsController.getResultsByRollNo(rollNo);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(result, response.getBody());
        verify(resultsService, times(1)).getResultsByRollNo(rollNo);
    }

    @Test
    void testGetResultsByRollNo_NotFound() {
        // Arrange
        String rollNo = "P202300CS3";
        when(resultsService.getResultsByRollNo(rollNo)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = resultsController.getResultsByRollNo(rollNo);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(resultsService, times(1)).getResultsByRollNo(rollNo);
    }
}
