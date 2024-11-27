import { Component, OnInit } from '@angular/core';
import { StudentDto } from '../../models/student-dto.model';
import { StudentService } from '../../services/student.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-student-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-crud.component.html',
  styleUrl: './student-crud.component.css',
})
export class StudentCrudComponent implements OnInit {
  students: StudentDto[] = [];
  currentStudent: StudentDto = new StudentDto();
  selectedStudent: StudentDto | null = null;
  showAddStudentForm: boolean = false;
  errorMessage: string = '';

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents(): void {
    this.studentService.getAll().subscribe({
      next: (data: StudentDto[]) => {
        this.students = data;
      },
      error: (err) => {
        this.errorMessage = 'Error fetching students. Please try again later.';
        console.error(err);
      },
    });
  }

  addStudent(): void {
    if (
      this.currentStudent.lastName &&
      this.currentStudent.firstMidName &&
      this.currentStudent.enrollmentDate
    ) {
      this.studentService.create(this.currentStudent).subscribe({
        next: () => {
          this.getStudents();
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage = 'Error adding student. Please try again later.';
          console.error(err);
        },
      });
    } else {
      this.errorMessage = 'Please fill out all fields.';
    }
  }

  editStudent(student: StudentDto): void {
    this.selectedStudent = { ...student };
    this.currentStudent = { ...student };
    this.showAddStudentForm = true;
  }

  updateStudent(): void {
    if (this.currentStudent) {
      this.studentService
        .update(this.currentStudent.id, this.currentStudent)
        .subscribe({
          next: () => {
            this.getStudents();
            this.resetForm();
          },
          error: (err) => {
            this.errorMessage =
              'Error updating student. Please try again later.';
            console.error(err);
          },
        });
    }
  }

  deleteStudent(id: number): void {
    this.studentService.delete(id).subscribe({
      next: () => {
        this.getStudents();
      },
      error: (err) => {
        this.errorMessage = 'Error deleting student. Please try again later.';
        console.error(err);
      },
    });
  }

  toggleAddStudentForm(): void {
    this.showAddStudentForm = !this.showAddStudentForm;
    if (!this.showAddStudentForm) {
      this.resetForm();
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.currentStudent = new StudentDto();
    this.selectedStudent = null;
    this.showAddStudentForm = false;
    this.errorMessage = '';
  }

  exportToExcel(): void {
    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.students.map((student) => ({
        ID: student.id,
        'Last Name': student.lastName,
        'First Name': student.firstMidName,
        'Enrollment Date': this.formatDate(student.enrollmentDate), // Use the formatDate function
      }))
    );

    // Create workbook and add worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');

    // Generate Excel file and download
    XLSX.writeFile(wb, 'students.xlsx');
  }

  formatDate(date: string | Date): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    }
    // If date is a string, attempt to parse it
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0];
  }
}
