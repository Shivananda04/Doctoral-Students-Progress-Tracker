package com.example.SE.Project.Service;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.example.SE.Project.Model.DCMeeting;
import com.example.SE.Project.Model.MeetingStatus;
import com.example.SE.Project.Model.Student;
import com.example.SE.Project.Repository.DCMeetingRepository;
import com.example.SE.Project.exception.FileStorageException;
import com.example.SE.Project.exception.ResourceNotFoundException;
import com.example.SE.Project.Repository.StudentRepository;
@Service

public class DCMeetingService {

    private final DCMeetingRepository meetingRepository;

    private final Path fileStorageLocation;

    private final StudentRepository studentRepository;
    public DCMeetingService(DCMeetingRepository meetingRepository, StudentRepository studentRepository) {
        this.meetingRepository = meetingRepository;
        this.studentRepository = studentRepository;
        this.fileStorageLocation = Paths.get("uploads/dc-meetings")
                .toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create upload directory", ex);
        }
    }

    public List<DCMeeting> getAllMeetings() {
        return meetingRepository.findAllByOrderByDateDesc();
    }

    public DCMeeting createMeeting(LocalDate date, String summary, MultipartFile file,String StudentEmail) {
        // Store file
        String filename = StringUtils.cleanPath(file.getOriginalFilename());
        String filepath = storeFile(file);
        Student student = studentRepository.findByEmail(StudentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        DCMeeting meeting = new DCMeeting();
        meeting.setDate(date);
        meeting.setSummary(summary);
        meeting.setFilename(filename);
        meeting.setFilepath(filepath);
        meeting.setStatus(MeetingStatus.SUBMITTED);
        meeting.setStudent(student);
        meeting.setComments("No comments yet");
        return meetingRepository.save(meeting);
    }

    public Resource downloadFile(Long meetingId) {
        DCMeeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting not found"));
        
        try {
            Path filePath = this.fileStorageLocation.resolve(meeting.getFilepath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found " + meeting.getFilename());
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File not found " + meeting.getFilename(), ex);
        }
    }

    private String storeFile(MultipartFile file) {
        // Validate file
        if (file.isEmpty()) {
            throw new FileStorageException("Failed to store empty file");
        }

        // Check for invalid characters
        String filename = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if (filename.contains("..")) {
                throw new FileStorageException("Filename contains invalid path sequence " + filename);
            }

            // Generate unique filename
            String uniqueFilename = System.currentTimeMillis() + "_" + filename;
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return uniqueFilename;
        } catch (IOException ex) {
            throw new FileStorageException("Failed to store file " + filename, ex);
        }
    }
}