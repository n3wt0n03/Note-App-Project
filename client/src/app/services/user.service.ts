import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users'; // Update with your backend base URL

  constructor(private http: HttpClient) {}

  // Update user profile
  updateUserProfile(userId: number, updatedUser: User): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/${userId}`, updatedUser, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  // Fetch user profile
  getUserProfile(userId: number): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/${userId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  //Helper method to get headers with token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    if (!token) {
      console.error('Authorization token is missing!'); // Log an error if the token is missing
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Add the token to the Authorization header
    });
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error); // Log the error for debugging
    return throwError(
      () =>
        new Error(
          error.message || 'Something went wrong, please try again later.'
        )
    );
  }
}
