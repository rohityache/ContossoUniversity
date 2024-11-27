import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { HeaderComponent } from '../../../Layout/header/header.component';
import { FooterComponent } from '../../../Layout/footer/footer.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ToastrModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  submissionError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: AuthService, // Inject the service,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*\W).*$/), // Validate at least one uppercase, digit, and non-alphanumeric
        ],
      ],
      role: ['', Validators.required],
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      this.registerService.registerUser(formData).subscribe(
        (response) => {
          console.log('User Registered:', response);
          // Redirect to login after successful registration
          if (response === 'User registered successfully!') {
            this.toastr.success('User Registered Succesfully!', 'Success');
            this.router.navigate(['/login']);
          } else {
            this.submissionError = 'Unexpected response from server.';
          }
        },
        (error) => {
          console.error('Registration Error:', error);
          this.submissionError = 'Registration failed. Please try again.';
        }
      );
    }
  }

  get passwordError(): string | null {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    } else if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    } else if (passwordControl?.hasError('pattern')) {
      return 'Password must have at least one uppercase letter, one digit, and one special character';
    }
    return null;
  }
}
