import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Base URL for backend API
  private tokenKey = 'authToken'; // Key for storing the token in localStorage

  constructor(private http: HttpClient) {}

  // Method to register a new user
  register(user: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, this.getHttpOptions()).pipe(
      catchError(this.handleError) // Error handling
    );
  }

  // Method to log in a user
  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user, this.getHttpOptions()).pipe(
      catchError(this.handleError) // Error handling
    );
  }

  // Save token to localStorage
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Retrieve token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove token from localStorage (logout)
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Method to retrieve HTTP options (e.g., headers)
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }

  // Centralized error handling
  private handleError(error: any): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client-side error:', error.error.message);
    } else {
      // Server-side error
      console.error('Server-side error:', error);
    }

    // Pass the error response to the component without overwriting it
    return throwError(() => error);
  }
}
