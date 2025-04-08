package com.example.SE.Project.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Id;


@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    private String id; 

    @Column(nullable = false)
    private String Dept;
    
    @Column(nullable = false)
    private String course_name;
    
    @Column(nullable = false)
    private String SME_Name;
    
    @Column(nullable = false)
    private String Institute;
    
    @Column(nullable = false)
    private String Co_Institute;
    
    @Column(nullable = false)
    private String Duration;
    
    @Column(nullable = false)
    private String TypeofCourse;
    
    @Column(nullable = false)
    private String StartDate;
    
    @Column(nullable = false)
    private String EndDate;
    
    @Column(nullable = false)
    private String ExamDate;
}
