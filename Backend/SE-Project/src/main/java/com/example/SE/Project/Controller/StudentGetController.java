package com.example.SE.Project.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.SE.Project.Model.Student;
import com.example.SE.Project.Repository.StudentRepository;
import com.example.SE.Project.Service.StudentService;

@RestController
@RequestMapping("/api/studentsyyyz")
public class StudentGetController {
    @Autowired
    private StudentService studentService;
    @Autowired
    private StudentRepository studentRepository;
    @GetMapping("/search")
    public List<Student> searchStudents(@RequestParam("q") String query) {
        return studentService.searchStudents(query);
    }

    @GetMapping
   public List<Map<String, Object>> getAllStudents() {
    List<Student> students = studentRepository.findAll();
    return students.stream().map(s -> {
        Map<String, Object> map = new HashMap<>();
        map.put("id", s.getId());
        map.put("name", s.getName());
        map.put("email", s.getEmail());
        map.put("roll", s.getRoll());
        map.put("userRole", s.getUserRole());
        return map;
    }).collect(Collectors.toList());
}
}
