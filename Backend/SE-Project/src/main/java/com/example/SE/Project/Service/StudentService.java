package com.example.SE.Project.Service;

import com.example.SE.Project.Model.Student;
import com.example.SE.Project.Repository.StudentRepository;

import lombok.AllArgsConstructor;

import com.example.SE.Project.Model.Supervisor;
import com.example.SE.Project.Repository.SupervisorRepository;

import org.apache.poi.sl.draw.geom.Guide;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class StudentService {
     @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SupervisorRepository supervisorRepository;

    @Autowired
    private ExcelUpload excelUpload; 
    public List<Student> saveStudentsFromExcel(MultipartFile file) {
        try {
            if (!ExcelUpload.isValidExcelFile(file)) {
                throw new IllegalArgumentException("Invalid Excel file format.");
            }

            InputStream inputStream = file.getInputStream();
            List<Student> students = excelUpload.getStudentsDataFromExcel(inputStream);
            for (Student student : students) {
                Supervisor supervisor = student.getSupervisor();

                if (supervisor != null) {
                    // Check if the supervisor exists in the database
                    Optional<Supervisor> existingSupervisor = supervisorRepository.findByEmail(supervisor.getEmail());
                    
                    if (existingSupervisor.isPresent()) {
                        student.setSupervisor(existingSupervisor.get()); 
                    } else {
                        supervisor = supervisorRepository.save(supervisor); 
                        student.setSupervisor(supervisor);
                    }
                }
            }
            

            return studentRepository.saveAll(students);
        } catch (Exception e) {
            throw new RuntimeException("Error saving students: " + e.getMessage(), e);
        }
    }

    
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
}
