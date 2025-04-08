package com.example.SE.Project.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.SE.Project.Model.Student;
import com.example.SE.Project.Service.ExcelUpload;
import com.example.SE.Project.Service.StudentService;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class StudentController {
    @Autowired
    private StudentService studentService;

    @Autowired
    private ExcelUpload excelUpload;

   @PostMapping("/upload")
public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
    try {
        System.out.println("at controller");
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }
        
        if (!excelUpload.isValidExcelFile(file)) {

            return ResponseEntity.badRequest().body("Please upload a valid .xlsx file");
        }

           System.out.println("at end controller");
        List<Student> result = studentService.saveStudentsFromExcel(file);
        return ResponseEntity.ok("Successfully uploaded " + result.size() + " students");
    } catch (Exception e) {
        System.out.println("at error controller");
        System.out.println(e.getMessage());
        return ResponseEntity.internalServerError()
            .body("Error: " + e.getMessage());
    }
}


}
