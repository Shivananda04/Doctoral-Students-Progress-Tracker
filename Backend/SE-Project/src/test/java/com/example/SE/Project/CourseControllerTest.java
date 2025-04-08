package com.example.SE.Project;

import com.example.SE.Project.Controller.CourseController;
import com.example.SE.Project.Model.Course;
import com.example.SE.Project.Service.CourseService;
import com.example.SE.Project.Service.Coursehelper;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.ResultMatcher;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CourseController.class)
public class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CourseService courseService;

    @MockBean
    private Coursehelper coursehelper;

    @Test
    public void testUploadValidExcelFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "courses.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "dummy-content".getBytes()
        );

        Course course = new Course("1", "CSE", "DSA", "Prof. Smith", "IITM", "IITB", "12 Weeks", "Core", "2024-01-01", "2024-04-01", null);
        List<Course> savedCourses = List.of(course);

        // Mock the behavior of Coursehelper and CourseService
        // Mockito.when(coursehelper.hasExcelFormat(file)).thenReturn(true);
        Mockito.when(courseService.saveCoursesFromExcel(file)).thenReturn(savedCourses);

        // mockMvc.perform(multipart("/api/swayam-courses/u").file(file))
                // .andExpect(status().isCreated())
                // .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    public void testUploadEmptyFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "empty.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                new byte[0]
        );

        mockMvc.perform(multipart("/api/swayam-courses/u").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("File is empty. Please upload a valid Excel file."));
    }

    private ResultActions andExpect(ResultMatcher badRequest) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'andExpect'");
    }

    @Test
    public void testUploadInvalidFormatFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "not_excel.txt", "text/plain",
                "invalid content".getBytes()
        );

        // Mock the behavior of Coursehelper
        Mockito.when(coursehelper.hasExcelFormat(file)).thenReturn(false);

        mockMvc.perform(multipart("/api/swayam-courses/u").file(file))
                .andExpect(status().isUnsupportedMediaType())
                .andExpect(content().string("Invalid file format. Please upload an Excel file (.xlsx or .xls)."));
    }
}