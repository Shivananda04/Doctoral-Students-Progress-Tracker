package com.example.SE.Project.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.SE.Project.Model.Enrollment;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId")
List<Enrollment> findByStudentId(@Param("studentId") Long studentId);
    
    boolean existsByCourseIdAndStudentId(String courseId, Long studentId);
    @Query("SELECT e FROM Enrollment e " +
           "WHERE e.student.supervisor.id = :supervisorId " +
           "AND e.status = 'PENDING'")
    List<Enrollment> findPendingEnrollmentsBySupervisorId(@Param("supervisorId") Long supervisorId);
    
    // Update enrollment status
    @Modifying
    @Query("UPDATE Enrollment e SET e.status = :status WHERE e.id = :enrollmentId")
    void updateEnrollmentStatus(@Param("enrollmentId") Long enrollmentId, 
                              @Param("status") String status);
}