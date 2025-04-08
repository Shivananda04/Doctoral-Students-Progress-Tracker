package com.example.SE.Project.Controller;

import com.example.SE.Project.Model.Course;
import com.example.SE.Project.Service.CourseService;
import com.example.SE.Project.Service.Coursehelper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/swayam-courses")
public class CourseController {

    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);

    @Autowired
    private CourseService courseService;

    @PostMapping("/u")
    public ResponseEntity<?> uploadCourses(@RequestParam("file") MultipartFile file) {
        logger.info("📥 Received file upload request: {}", file.getOriginalFilename());

        if (file.isEmpty()) {
            logger.warn("⚠️ Uploaded file is empty.");
            return ResponseEntity.badRequest().body("File is empty. Please upload a valid Excel file.");
        }

        if (!Coursehelper.hasExcelFormat(file)) {
            logger.warn("❌ Invalid file format: {}", file.getContentType());
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    .body("Invalid file format. Please upload an Excel file (.xlsx or .xls).");
        }

        try {
            List<Course> savedCourses = courseService.saveCoursesFromExcel(file);
            
            logger.info("✅ Successfully uploaded {} CSE courses.", savedCourses.size());

            if (savedCourses.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No 'Computer Science and Engineering' courses found in the file.");
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(savedCourses);

        } catch (Exception e) {
            logger.error("❌ Error processing Excel file: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing file: " + e.getMessage());
        }
    }
}
