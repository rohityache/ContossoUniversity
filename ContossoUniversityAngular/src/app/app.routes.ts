import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './core/shared/user-dashboard/user-dashboard.component';
import { LoginComponent } from './core/shared/login/login.component';
import { RegisterComponent } from './core/shared/register/register.component';
import { AdminDashboardComponent } from './features/AdminAccess/components/admin-dashboard/admin-dashboard.component';
import { InstructorDashboardComponent } from './features/instructor-dashboard/instructor-dashboard.component';
import { StudentDashboardComponent } from './features/student-dashboard/student-dashboard.component';
import { AdminRoutingModule } from './features/AdminAccess/admin.routes';

export const routes: Routes = [
  { path: '', component: UserDashboardComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'student-dashboard', component: StudentDashboardComponent },
  { path: 'instructor-dashboard', component: InstructorDashboardComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/AdminAccess/admin.routes').then(
        (m) => m.AdminRoutingModule
      ),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
