package com.example.SE.Project.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "dc_meetings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DCMeeting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    private String filepath = "";

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MeetingStatus status = MeetingStatus.SUBMITTED;

    @Column
    private String comments;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    @JsonBackReference(value = "student-meetings") 
    private Student student;

    
}