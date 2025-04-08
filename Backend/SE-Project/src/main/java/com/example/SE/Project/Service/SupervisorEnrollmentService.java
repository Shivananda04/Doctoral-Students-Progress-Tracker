package com.example.SE.Project.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.SE.Project.Repository.CourseRepository;
import com.example.SE.Project.Model.Course;
import com.example.SE.Project.Model.Enrollment;
import com.example.SE.Project.Repository.EnrollmentRepository;
import com.example.SE.Project.Repository.SupervisorRepository;

@Service
public class SupervisorEnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private SupervisorRepository supervisorRepository;

    public List<Enrollment> getPendingEnrollments(Long supervisorId) {
    List<Enrollment> enrollments = enrollmentRepository.findPendingEnrollmentsBySupervisorId(supervisorId);

    for (Enrollment enrollment : enrollments) {
        Course course = courseRepository.findById(enrollment.getCourseId()).orElse(null);
        enrollment.setCourse(course); // manually inject course
    }

    return enrollments;
}

    public void approveEnrollment(Long enrollmentId) {
        enrollmentRepository.updateEnrollmentStatus(enrollmentId, "APPROVED");
    }

    public void rejectEnrollment(Long enrollmentId) {
        enrollmentRepository.updateEnrollmentStatus(enrollmentId, "REJECTED");
    }
}
