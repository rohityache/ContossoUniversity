import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <i class="bi bi-bank fs-2"></i>
          Contosso University
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <button
                class="btn btn-outline-primary nav-link"
                (click)="navigateTo('/student-dashboard')"
              >
                <i class="bi bi-house-door-fill fs-5"></i>
                Home
              </button>
            </li>
            <li class="nav-item">
              <button
                class="btn btn-outline-danger nav-link"
                (click)="logout()"
              >
                <i class="bi bi-box-arrow-right fs-5"></i>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="dashboard">
      <h2>Instructor Dashboard</h2>
      <div class="actions">
        <button (click)="createCourse()">Create New Course</button>
        <button (click)="manageCourses()">Manage Courses</button>
      </div>
      <div class="cards-container">
        <div class="card" *ngFor="let course of assignedCourses">
          <h3>{{ course.name }}</h3>
          <p>{{ course.description }}</p>
          <button (click)="editCourse(course.id)">Edit Course</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        padding: 20px;
        text-align: center;
      }
      .actions {
        margin-bottom: 20px;
      }
      button {
        background-color: #28a745;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin: 10px;
      }
      button:hover {
        background-color: #218838;
      }
      .cards-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
      }
      .card {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 15px;
        width: 200px;
        text-align: center;
      }
    `,
  ],
})
export class InstructorDashboardComponent {
  constructor(private router: Router) {}
  assignedCourses = [
    {
      id: 1,
      name: 'Advanced Mathematics',
      description: 'Advanced topics in Mathematics',
    },
    { id: 2, name: 'Physics 201', description: 'Intermediate Physics topics' },
  ];

  createCourse() {
    console.log('Navigating to course creation page');
    // Logic to navigate to the course creation page
  }

  manageCourses() {
    console.log('Navigating to manage courses page');
    // Logic to navigate to manage courses page
  }

  editCourse(courseId: number) {
    console.log(`Editing course with ID: ${courseId}`);
    // Logic to edit course details
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/user-dashboard']);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
