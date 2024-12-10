import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Added HttpClientModule
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, HttpClientModule], // Added HttpClientModule
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  message: string = '';
  emailError: string = '';
  passwordError: string = '';
  isSubmitting: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    // Reset errors
    this.resetErrors();

    // Frontend Validation
    if (!this.validateInputs()) {
      return;
    }

    this.isSubmitting = true;
    const user = { email: this.email, password: this.password };

    this.authService.login(user).subscribe({
      next: (response: any) => {
        this.handleSuccessfulLogin(response);
      },
      error: (error) => {
        this.handleLoginError(error);
      },
    });
  }

  private resetErrors(): void {
    this.emailError = '';
    this.passwordError = '';
    this.message = '';
  }

  private validateInputs(): boolean {
    let isValid = true;

    if (!this.email) {
      this.emailError = 'Email is required.';
      isValid = false;
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(this.email)
    ) {
      this.emailError = 'Invalid email format.';
      isValid = false;
    }

    if (!this.password) {
      this.passwordError = 'Password is required.';
      isValid = false;
    }

    return isValid;
  }

  private handleSuccessfulLogin(response: any): void {
    this.message = 'Login successful!';
    this.isSubmitting = false;

    // Save token and user data in localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response));

    // Redirect to dashboard
    this.router.navigate(['/dashboard']);
  }

  private handleLoginError(error: any): void {
    this.isSubmitting = false;

    const backendMessage =
      error?.error?.message || 'An unknown error occurred.';
    switch (backendMessage) {
      case 'Email is required!':
        this.emailError = 'Email is required.';
        break;
      case 'Password is required!':
        this.passwordError = 'Password is required.';
        break;
      case 'Email does not exist!':
        this.emailError = 'Email does not exist.';
        break;
      case 'Invalid password!':
        this.passwordError = 'Invalid password.';
        break;
      default:
        this.message = backendMessage;
        break;
    }

    console.error('Login error:', error); // Debugging
  }
}
