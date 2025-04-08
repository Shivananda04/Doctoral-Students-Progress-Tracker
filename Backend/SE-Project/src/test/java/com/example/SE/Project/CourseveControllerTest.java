package com.example.SE.Project;

import com.example.SE.Project.Model.Course;
import com.example.SE.Project.Model.Enrollment;
import com.example.SE.Project.Model.Student;
import com.example.SE.Project.Repository.CourseRepository;
import com.example.SE.Project.Repository.EnrollmentRepository;
import com.example.SE.Project.Repository.StudentRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.example.SE.Project.Controller.CourseveController;

import java.security.Principal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class CourseveControllerTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private CourseveController courseveController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAvailableCourses() {
        // Arrange
        List<Course> courses = Arrays.asList(
                new Course("1", "CSE", "Data Structures", "Prof. Smith", "IITM", "IITB", "12 Weeks", "Core", "2024-01-01", "2024-04-01", "2024-04-15"),
                new Course("2", "CSE", "Algorithms", "Prof. John", "IITD", "IITK", "8 Weeks", "Elective", "2024-02-01", "2024-03-31", "2024-04-10")
        );
        when(courseRepository.findAll()).thenReturn(courses);

        // Act
        ResponseEntity<List<Course>> response = courseveController.getAvailableCourses();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(courses, response.getBody());
    }

    @Test
    public void testGetEnrolledCourses() {
        // Arrange
        Principal principal = mock(Principal.class);
        when(principal.getName()).thenReturn("student@example.com");

        Student student = new Student();
        student.setId(1L);
        student.setEmail("student@example.com");

        Enrollment enrollment1 = new Enrollment();
        enrollment1.setId(1L);
        enrollment1.setCourseId("1");
        enrollment1.setStudent(student);
        enrollment1.setStatus("ACCEPTED");
        enrollment1.setEnrollmentDate(LocalDate.now());

        Enrollment enrollment2 = new Enrollment();
        enrollment2.setId(2L);
        enrollment2.setCourseId("2");
        enrollment2.setStudent(student);
        enrollment2.setStatus("PENDING");
        enrollment2.setEnrollmentDate(LocalDate.now());

        List<Enrollment> enrollments = Arrays.asList(enrollment1, enrollment2);

        when(studentRepository.findByEmail("student@example.com")).thenReturn(Optional.of(student));
        when(enrollmentRepository.findByStudentId(1L)).thenReturn(enrollments);

        // Act
        ResponseEntity<?> response = courseveController.getEnrolledCourses(principal);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(enrollments, response.getBody());
    }

    @Test
    public void testEnrollInCourse_Success() {
        // Arrange
        Principal principal = mock(Principal.class);
        when(principal.getName()).thenReturn("student@example.com");

        Student student = new Student();
        student.setId(1L);
        student.setEmail("student@example.com");

        Course course = new Course("1", "CSE", "Data Structures", "Prof. Smith", "IITM", "IITB", "12 Weeks", "Core", "2024-01-01", "2024-04-01", "2024-04-15");

        when(studentRepository.findByEmail("student@example.com")).thenReturn(Optional.of(student));
        when(courseRepository.findById("1")).thenReturn(Optional.of(course));
        when(enrollmentRepository.existsByCourseIdAndStudentId("1", 1L)).thenReturn(false);

        Enrollment enrollment = new Enrollment();
        enrollment.setCourseId("1");
        enrollment.setStudent(student);
        enrollment.setStatus("PENDING");
        enrollment.setEnrollmentDate(LocalDate.now());

        when(enrollmentRepository.save(any(Enrollment.class))).thenReturn(enrollment);

        // Act
        ResponseEntity<?> response = courseveController.enrollInCourse("1", principal);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(enrollment, response.getBody());
    }

    @Test
    public void testEnrollInCourse_AlreadyEnrolled() {
        // Arrange
        Principal principal = mock(Principal.class);
        when(principal.getName()).thenReturn("student@example.com");

        Student student = new Student();
        student.setId(1L);
        student.setEmail("student@example.com");

        when(studentRepository.findByEmail("student@example.com")).thenReturn(Optional.of(student));
        when(enrollmentRepository.existsByCourseIdAndStudentId("1", 1L)).thenReturn(true);

        // Act
        ResponseEntity<?> response = courseveController.enrollInCourse("1", principal);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Already enrolled in this course", response.getBody());
    }
}
