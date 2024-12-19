import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { last } from 'rxjs';

@Component({
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  message: string = '';

  firstNameError: string = '';
  lastNameError: string = '';
  usernameError: string = '';
  emailError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  isSubmitting: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Check for saved theme preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.setDarkMode(isDarkMode);
  }

  toggleDarkMode() {
    const isDarkMode = document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', isDarkMode.toString());
  }

  setDarkMode(isDarkMode: boolean) {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  onRegister(): void {
    this.firstNameError = '';
    this.lastNameError = '';
    this.usernameError = '';
    this.emailError = '';
    this.passwordError = '';
    this.message = '';

    // Frontend Validation
    if (!this.firstName) {
      this.firstNameError = 'First name is required.';
    }
    if (!this.lastName) {
      this.lastNameError = 'Last name is required.';
    }
    if (!this.username) {
      this.usernameError = 'Username is required.';
    }
    if (!this.email) {
      this.emailError = 'Email is required.';
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(this.email)
    ) {
      this.emailError = 'Invalid email format.';
    }
    if (!this.password) {
      this.passwordError = 'Password is required.';
    } else if (this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters long.';
    }
    if (this.password !== this.confirmPassword) {
      this.passwordError = 'Passwords do not match.';
    }

    if (
      this.firstNameError ||
      this.lastNameError ||
      this.usernameError ||
      this.emailError ||
      this.passwordError
    ) {
      return;
    }

    const user = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
    };

    this.authService.register(user).subscribe({
      next: () => {
        this.message = 'Registration successful! Redirecting...';
        this.isSubmitting = false;

        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isSubmitting = false;

        const backendMessage = error?.error?.message;

        if (backendMessage === 'Passwords do not match!') {
          this.passwordError = 'Passwords do not match.';
        } else if (backendMessage === 'Email already exists!') {
          this.emailError =
            'Email already exists. Please use a different email.';
        } else {
          this.message = 'An unknown error occurred. Please try again.';
        }
      },
    });
  }
}
