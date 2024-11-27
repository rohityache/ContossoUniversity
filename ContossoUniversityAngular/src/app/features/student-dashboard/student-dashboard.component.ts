import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Course } from '../../core/models/Course';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../Layout/header/header.component';
import { FooterComponent } from '../../Layout/footer/footer.component';
import { Router } from '@angular/router';
import { DepartmentDto } from '../AdminAccess/models/department-dto.model';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HeaderComponent,
    FooterComponent,
  ],
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
})
export class StudentDashboardComponent implements OnInit {
  courses: Course[] = [];
  departments: DepartmentDto[] = [];
  showModal = false;
  selectedDepartment: any = {};
  courseInformation!: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getDepartments().subscribe((data) => {
      this.departments = data;
    });
  }

  viewCourse(courseId: number): void {
    console.log(`Viewing course with ID: ${courseId}`);
    this.courseInfo(courseId);
    // Logic to view the course details can be implemented here
  }

  courseInfo(courseId: number): any {
    console.log(`Course info for course with ID: ${courseId}`);
    // Logic to view the course details can be implemented here
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/user-dashboard']);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  openCourseModal(departmentId: number) {
    this.showModal = true;
    this.authService.getCoursesByDept(departmentId).subscribe(
      (data: any) => {
        //debug response data
        console.log('Courses: ', data);

        this.courses = Array.isArray(data) ? data : [];
        this.selectedDepartment = this.departments.find(
          (d) => d.departmentID === departmentId
        );
      },
      (error) => {
        console.error('Error fetching courses: ', error);
      }
    );
  }

  closeModal() {
    this.showModal = false;
    this.courses = [];
  }
  enrollInCourse(courseId: number) {
    console.log(`Enrolling in course with ID: ${courseId}`);
    // will implement
  }
}
