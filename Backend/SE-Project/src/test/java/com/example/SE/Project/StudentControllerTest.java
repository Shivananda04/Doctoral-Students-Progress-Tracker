package com.example.SE.Project;

import com.example.SE.Project.Model.Student;
import com.example.SE.Project.Service.ExcelUpload;
import com.example.SE.Project.Service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import com.example.SE.Project.Controller.StudentController;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class StudentControllerTest {

    @Mock
    private StudentService studentService;

    @Mock
    private ExcelUpload excelUpload;

    @InjectMocks
    private StudentController studentController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testUploadFile_Success() {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "students.xlsx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "test data".getBytes()
        );

        List<Student> students = Arrays.asList(
            createStudent(1L, "John Doe", "P202300CS1", "john@example.com"),
            createStudent(2L, "Jane Smith", "P202300CS2", "jane@example.com")
        );

        // when(excelUpload.isValidExcelFile(file)).thenReturn(true);
        when(studentService.saveStudentsFromExcel(file)).thenReturn(students);

        // Act
        ResponseEntity<String> response = studentController.uploadFile(file);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Successfully uploaded 2 students", response.getBody());
        verify(excelUpload, times(1)).isValidExcelFile(file);
        // verify(studentService, times(1)).saveStudentsFromExcel(file);
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
        ResponseEntity<String> response = studentController.uploadFile(emptyFile);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("File is empty", response.getBody());
        // verify(excelUpload, never()).isValidExcelFile(any());
        verify(studentService, never()).saveStudentsFromExcel(any());
    }

    @Test
    void testUploadFile_InvalidInvalidFormat() {
        // Arrange
        MockMultipartFile invalidFile = new MockMultipartFile(
            "file",
            "invalid.txt",
            "text/plain",
            "test data".getBytes()
        );

        when(excelUpload.isValidExcelFile(invalidFile)).thenReturn(false);

        // Act
        ResponseEntity<String> response = studentController.uploadFile(invalidFile);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Please upload a valid .xlsx file", response.getBody());
        verify(excelUpload, times(1)).isValidExcelFile(invalidFile);
        verify(studentService, never()).saveStudentsFromExcel(any());
    }

    @Test
    void testUploadFile_ServiceError() {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "students.xlsx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "test data".getBytes()
        );

        // when(excelUpload.isValidExcelFile(file)).thenReturn(true);
        when(studentService.saveStudentsFromExcel(file)).thenThrow(new RuntimeException("Database error"));

        // Act
        ResponseEntity<String> response = studentController.uploadFile(file);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error: Database error", response.getBody());
        // verify(excelUpload, times(1)).isValidExcelFile(file);
        verify(studentService, times(1)).saveStudentsFromExcel(file);
    }

    // Helper method to create Student objects
    private Student createStudent(Long id, String name, String roll, String email) {
        Student student = new Student();
        student.setId(id);
        student.setName(name);
        student.setRoll(roll);
        student.setEmail(email);
        return student;
    }
}