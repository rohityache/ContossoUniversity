import { Component, OnInit } from '@angular/core';
import { InstructorDto } from '../../models/instructor-dto.model';
import { InstructorService } from '../../services/instructor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-instructor-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './instructor-crud.component.html',
  styleUrl: './instructor-crud.component.css',
})
export class InstructorCrudComponent implements OnInit {
  instructors: InstructorDto[] = [];
  currentInstructor: InstructorDto = new InstructorDto();
  selectedInstructor: InstructorDto | null = null;
  showAddInstructorForm: boolean = false;
  errorMessage: string = '';

  constructor(private instructorService: InstructorService) {}

  ngOnInit(): void {
    this.getInstructors();
  }

  getInstructors(): void {
    this.instructorService.getAll().subscribe({
      next: (data: InstructorDto[]) => {
        this.instructors = data;
      },
      error: (err) => {
        this.errorMessage =
          'Error fetching instructors. Please try again later.';
        console.error(err);
      },
    });
  }

  addInstructor(): void {
    if (
      this.currentInstructor.lastName &&
      this.currentInstructor.firstMidName &&
      this.currentInstructor.hireDate
    ) {
      this.instructorService.create(this.currentInstructor).subscribe({
        next: () => {
          this.getInstructors();
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage =
            'Error adding instructor. Please try again later.';
          console.error(err);
        },
      });
    } else {
      this.errorMessage = 'Please fill out all fields.';
    }
  }

  editInstructor(instructor: InstructorDto): void {
    this.selectedInstructor = { ...instructor };
    this.currentInstructor = { ...instructor };
    this.showAddInstructorForm = true;
  }

  updateInstructor(): void {
    if (this.currentInstructor) {
      this.instructorService
        .update(this.currentInstructor.id, this.currentInstructor)
        .subscribe({
          next: () => {
            this.getInstructors();
            this.resetForm();
          },
          error: (err) => {
            this.errorMessage =
              'Error updating instructor. Please try again later.';
            console.error(err);
          },
        });
    }
  }

  deleteInstructor(id: number): void {
    this.instructorService.delete(id).subscribe({
      next: () => {
        this.getInstructors();
      },
      error: (err) => {
        this.errorMessage =
          'Error deleting instructor. Please try again later.';
        console.error(err);
      },
    });
  }

  toggleAddInstructorForm(): void {
    this.showAddInstructorForm = !this.showAddInstructorForm;
    if (!this.showAddInstructorForm) {
      this.resetForm();
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.currentInstructor = new InstructorDto();
    this.selectedInstructor = null;
    this.showAddInstructorForm = false;
    this.errorMessage = '';
  }

  exportToExcel(): void {
    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.instructors.map((instructor) => ({
        ID: instructor.id,
        'Last Name': instructor.lastName,
        'First Name': instructor.firstMidName,
        'Hire Date': instructor.hireDate.toISOString().split('T')[0],
      }))
    );

    // Create workbook and add worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Instructors');

    // Generate Excel file and download
    XLSX.writeFile(wb, 'instructors.xlsx');
  }
}
