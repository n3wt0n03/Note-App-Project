import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  message: string = '';
  emailError: string = '';
  passwordError: string = '';
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

  onLogin(): void {
    // Reset errors
    this.emailError = '';
    this.passwordError = '';
    this.message = '';

    // Frontend Validation
    if (!this.email) {
      this.emailError = 'Email is required.';
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(this.email)) {
      this.emailError = 'Invalid email format.';
    }

    if (!this.password) {
      this.passwordError = 'Password is required.';
    }

    if (this.emailError || this.passwordError) {
      return;
    }

    this.isSubmitting = true;

    const user = { email: this.email, password: this.password };

    this.authService.login(user).subscribe({
      next: (response: any) => {
        this.message = 'Login successful!';
        this.isSubmitting = false;

        // Save token and user data in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response));

        // Redirect to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isSubmitting = false;

        const backendMessage = error?.error?.message;

        if (backendMessage === 'Email is required!') {
          this.emailError = 'Email is required.';
        } else if (backendMessage === 'Password is required!') {
          this.passwordError = 'Password is required.';
        } else if (backendMessage === 'Email does not exist!') {
          this.emailError = 'Email does not exist.';
        } else if (backendMessage === 'Invalid password!') {
          this.passwordError = 'Invalid password.';
        } else {
          this.message = 'An unknown error occurred. Please try again.';
        }

        console.error('Login error:', error); // Debugging
      },
    });
  }
}
