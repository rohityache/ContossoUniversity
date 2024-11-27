import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { DepartmentDto } from '../../models/department-dto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-department-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-crud.component.html',
  styleUrl: './department-crud.component.css',
})
export class DepartmentCrudComponent implements OnInit {
  departments: DepartmentDto[] = [];
  currentDepartment: DepartmentDto = new DepartmentDto();
  selectedDepartment: DepartmentDto | null = null;
  showAddDepartmentForm: boolean = false;
  errorMessage: string = '';

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (data: DepartmentDto[]) => {
        this.departments = data;
      },
      error: (err) => {
        this.errorMessage =
          'Error fetching departments. Please try again later.';
        console.error(err);
      },
    });
  }

  addDepartment(): void {
    if (
      this.currentDepartment.name &&
      this.currentDepartment.budget &&
      this.currentDepartment.startDate
    ) {
      this.departmentService.create(this.currentDepartment).subscribe({
        next: () => {
          this.getDepartments();
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage =
            'Error adding department. Please try again later.';
          console.error(err);
        },
      });
    } else {
      this.errorMessage = 'Please fill out all fields.';
    }
  }

  editDepartment(department: DepartmentDto): void {
    this.selectedDepartment = { ...department };
    this.currentDepartment = { ...department };
    this.showAddDepartmentForm = true;
  }

  updateDepartment(): void {
    if (this.currentDepartment) {
      this.departmentService
        .update(this.currentDepartment.departmentID, this.currentDepartment)
        .subscribe({
          next: () => {
            this.getDepartments();
            this.resetForm();
          },
          error: (err) => {
            this.errorMessage =
              'Error updating department. Please try again later.';
            console.error(err);
          },
        });
    }
  }

  deleteDepartment(id: number): void {
    this.departmentService.delete(id).subscribe({
      next: () => {
        this.getDepartments();
      },
      error: (err) => {
        this.errorMessage =
          'Error deleting department. Please try again later.';
        console.error(err);
      },
    });
  }

  toggleAddDepartmentForm(): void {
    this.showAddDepartmentForm = !this.showAddDepartmentForm;
    if (!this.showAddDepartmentForm) {
      this.resetForm();
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.currentDepartment = new DepartmentDto();
    this.selectedDepartment = null;
    this.showAddDepartmentForm = false;
    this.errorMessage = '';
  }
  exportToExcel(): void {
    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.departments.map((department) => ({
        'Department ID': department.departmentID,
        Name: department.name,
        Budget: department.budget,
        'Start Date': department.startDate.toISOString().split('T')[0],
        'Instructor ID': department.instructorID,
      }))
    );

    // Create workbook and add worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Departments');

    // Generate Excel file and download
    XLSX.writeFile(wb, 'departments.xlsx');
  }
}
