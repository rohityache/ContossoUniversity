import { Component, OnInit } from '@angular/core';
import { CourseDto } from '../../models/course-dto.model';
import { CourseService } from '../../services/course.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-course-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-crud.component.html',
  styleUrl: './course-crud.component.css',
})
export class CourseCrudComponent implements OnInit {
  courses: CourseDto[] = [];
  newCourse: CourseDto = new CourseDto();
  showAddCourseForm: boolean = false;
  errorMessage: string = '';

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses(): void {
    this.courseService.getAll().subscribe({
      next: (data: CourseDto[]) => {
        this.courses = data;
      },
      error: (err) => {
        this.errorMessage = 'Error fetching courses. Please try again later.';
        console.error(err);
      },
    });
  }

  addCourse(): void {
    if (
      this.newCourse.title &&
      this.newCourse.credits &&
      this.newCourse.departmentID
    ) {
      this.courseService.create(this.newCourse).subscribe({
        next: () => {
          this.getCourses();
          this.newCourse = new CourseDto();
          this.showAddCourseForm = false;
        },
        error: (err) => {
          this.errorMessage = 'Error adding course. Please try again later.';
          console.error(err);
        },
      });
    } else {
      this.errorMessage = 'Please fill out all fields.';
    }
  }

  updateCourse(course: CourseDto): void {
    this.courseService.update(course.courseID, course).subscribe({
      next: () => {
        this.getCourses();
      },
      error: (err) => {
        this.errorMessage = 'Error updating course. Please try again later.';
        console.error(err);
      },
    });
  }

  deleteCourse(id: number): void {
    this.courseService.delete(id).subscribe({
      next: () => {
        this.getCourses();
      },
      error: (err) => {
        this.errorMessage = 'Error deleting course. Please try again later.';
        console.error(err);
      },
    });
  }

  toggleAddCourseForm(): void {
    this.showAddCourseForm = !this.showAddCourseForm;
  }

  exportToExcel(): void {
    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.courses.map((course) => ({
        'Course ID': course.courseID,
        Title: course.title,
        Credits: course.credits,
        'Department ID': course.departmentID,
      }))
    );

    // Create workbook and add worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Courses');

    // Generate Excel file and download
    XLSX.writeFile(wb, 'courses.xlsx');
  }
}
