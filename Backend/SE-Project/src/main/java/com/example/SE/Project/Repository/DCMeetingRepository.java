package com.example.SE.Project.Repository;

import com.example.SE.Project.Model.DCMeeting;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.SE.Project.Model.MeetingStatus;
import com.example.SE.Project.Model.Student;

import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public interface DCMeetingRepository extends JpaRepository<DCMeeting, Long> {
    

    List<DCMeeting> findAllByOrderByDateDesc();
    List<DCMeeting> findByStudentIdInAndStatus(List<Long> studentIds, MeetingStatus status);
    List<DCMeeting> findByStudentIdIn(List<Long> studentIds);
}