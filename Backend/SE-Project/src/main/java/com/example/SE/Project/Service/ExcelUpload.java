package com.example.SE.Project.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.SE.Project.Model.Student;
import com.example.SE.Project.Model.Supervisor;

@Service
public class ExcelUpload {
    public static boolean isValidExcelFile(MultipartFile file){
        return Objects.equals(file.getContentType(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" );
    }
    public List<Student> getStudentsDataFromExcel(InputStream inputStream) {
        List<Student> students = new ArrayList<>();
        DataFormatter formatter = new DataFormatter(); // Handles different data types

        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            boolean firstRow = true;

            while (rows.hasNext()) {
                Row row = rows.next();
                if (firstRow) { 
                    firstRow = false;
                    continue;
                }

                String studentRoll = formatter.formatCellValue(row.getCell(0)).trim();
                String studentName = formatter.formatCellValue(row.getCell(1)).trim();
                String supervisorName = formatter.formatCellValue(row.getCell(2)).trim();
                String studentEmail = formatter.formatCellValue(row.getCell(3)).trim();
                String supervisorEmail = formatter.formatCellValue(row.getCell(4)).trim();


                
                Student student = new Student();
                student.setRoll(studentRoll);
                student.setName(studentName);
                student.setSupervisor(new Supervisor(supervisorName, supervisorEmail)); 
                student.setEmail(studentEmail);
                

                students.add(student);
            }
        } catch (IOException e) {
            throw new RuntimeException("Error processing Excel file: " + e.getMessage());
        }

        return students; 
    }
}