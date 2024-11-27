import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CourseCrudComponent } from './components/course-crud/course-crud.component';
import { DepartmentCrudComponent } from './components/department-crud/department-crud.component';
import { EnrollmentCrudComponent } from './components/enrollment-crud/enrollment-crud.component';
import { InstructorCrudComponent } from './components/instructor-crud/instructor-crud.component';
import { StudentCrudComponent } from './components/student-crud/student-crud.component';
const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent, // Admin Dashboard will be the default component
    // Protect with AuthGuard if needed
    children: [
      { path: 'students', component: StudentCrudComponent },
      { path: 'instructors', component: InstructorCrudComponent },
      { path: 'enrollments', component: EnrollmentCrudComponent },
      { path: 'departments', component: DepartmentCrudComponent },
      { path: 'courses', component: CourseCrudComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
