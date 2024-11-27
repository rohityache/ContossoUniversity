import { Component, OnInit } from '@angular/core';
import { EnrollmentDto } from '../../models/enrollment-dto.model';
import { EnrollmentService } from '../../services/enrollment.service';
import { Grade } from '../../models/grade.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-enrollment-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enrollment-crud.component.html',
  styleUrl: './enrollment-crud.component.css',
})
export class EnrollmentCrudComponent implements OnInit {
  enrollments: EnrollmentDto[] = [];
  currentEnrollment: EnrollmentDto = <EnrollmentDto>{};
  selectedEnrollment: EnrollmentDto | null = null;
  showAddEnrollmentForm: boolean = false;
  grades: string[] = ['A', 'B', 'C', 'D', 'F'];
  errorMessage: string = '';

  constructor(private enrollmentService: EnrollmentService) {}

  ngOnInit(): void {
    this.getEnrollments();
  }

  getEnrollments(): void {
    this.enrollmentService.getAll().subscribe({
      next: (data: EnrollmentDto[]) => {
        this.enrollments = data;
      },
      error: (err) => {
        this.errorMessage =
          'Error fetching enrollments. Please try again later.';
        console.error(err);
      },
    });
  }

  addEnrollment(): void {
    if (
      this.currentEnrollment.courseID &&
      this.currentEnrollment.studentID &&
      this.currentEnrollment.grade
    ) {
      this.enrollmentService.create(this.currentEnrollment).subscribe({
        next: () => {
          this.getEnrollments();
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage =
            'Error adding enrollment. Please try again later.';
          console.error(err);
        },
      });
    } else {
      this.errorMessage = 'Please fill out all fields.';
    }
  }

  editEnrollment(enrollment: EnrollmentDto): void {
    this.selectedEnrollment = { ...enrollment };
    this.currentEnrollment = { ...enrollment };
    this.showAddEnrollmentForm = true;
  }

  updateEnrollment(): void {
    if (this.currentEnrollment) {
      this.enrollmentService
        .update(this.currentEnrollment.enrollmentID, this.currentEnrollment)
        .subscribe({
          next: () => {
            this.getEnrollments();
            this.resetForm();
          },
          error: (err) => {
            this.errorMessage =
              'Error updating enrollment. Please try again later.';
            console.error(err);
          },
        });
    }
  }

  deleteEnrollment(id: number): void {
    this.enrollmentService.delete(id).subscribe({
      next: () => {
        this.getEnrollments();
      },
      error: (err) => {
        this.errorMessage =
          'Error deleting enrollment. Please try again later.';
        console.error(err);
      },
    });
  }

  toggleAddEnrollmentForm(): void {
    this.showAddEnrollmentForm = !this.showAddEnrollmentForm;
    if (!this.showAddEnrollmentForm) {
      this.resetForm();
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.currentEnrollment = <EnrollmentDto>{};
    this.selectedEnrollment = null;
    this.showAddEnrollmentForm = false;
    this.errorMessage = '';
  }
  exportToExcel(): void {
    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.enrollments.map((enrollment) => ({
        'Enrollment ID': enrollment.enrollmentID,
        'Course ID': enrollment.courseID,
        'Student ID': enrollment.studentID,
        Grade: enrollment.grade,
      }))
    );

    // Create workbook and add worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Enrollments');

    // Generate Excel file and download
    XLSX.writeFile(wb, 'enrollments.xlsx');
  }
}
