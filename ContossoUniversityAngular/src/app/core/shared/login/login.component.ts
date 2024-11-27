// login.component.ts
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../Layout/header/header.component';
import { FooterComponent } from '../../../Layout/footer/footer.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
// import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    ToastrModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ToastrService],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Call the authentication service to login
      this.authService.login(email, password).subscribe(
        (response) => {
          //Implemented an authentication guard to redirect to the dashboard if the user is already logged in
          // Get the JWT token from the response
          const token = response.token; // Assuming the response contains the token
          localStorage.setItem('token', token); // Save the token in local storage

          // Decode JWT token to get user information
          const decodedToken: any = jwtDecode(token);
          const role = decodedToken.Role;
          console.log('Decoded Token:', decodedToken); // Log the decoded token

          //Logic to redirect to the appropriate dashboard based on the user role
          // Navigate to appropriate dashboard based on role
          if (role === 'student') {
            this.toastr.success('Login successful as Student', 'Login');
            this.router.navigate(['student-dashboard']);
          } else if (role === 'instructor') {
            this.toastr.success('Login successful as Instructor', 'Login');
            this.router.navigate(['instructor-dashboard']);
          } else if (role === 'admin') {
            this.toastr.success('Login successful as Admin', 'Login');
            this.router.navigate(['admin']);
          }
        },
        (error) => {
          if (error.status === 0) {
            this.toastr.warning('Check the Connection', 'Network Error');
          } else {
            // Handle other errors such as invalid login credentials
            this.errorMessage = 'Invalid login credentials. Please try again.';
          }
        }
      );
    }
  }
}
