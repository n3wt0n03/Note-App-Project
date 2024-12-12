import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category } from '../model/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/categories'; // API endpoint for categories

  constructor(private http: HttpClient) {}

  // Fetch all categories
  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        // Optionally sort on the frontend if needed
        catchError(this.handleError)
      );
  }

  // Fetch a single category by ID
  getCategoryById(id: number): Observable<Category> {
    return this.http
      .get<Category>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Create a new category
  createCategory(category: Category): Observable<Category> {
    return this.http
      .post<Category>(this.apiUrl, category, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Update an existing category by ID
  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http
      .put<Category>(`${this.apiUrl}/${id}`, category, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  // Delete a category by ID
  deleteCategory(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Reorder categories
  reorderCategories(orderedCategoryIds: number[]): Observable<void> {
    return this.http
      .put<void>(`${this.apiUrl}/reorder`, orderedCategoryIds, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  // Helper method to get headers with token
  private getHeaders(): HttpHeaders {
    const user = localStorage.getItem('user');
    if (!user) {
      console.error('User information is missing! Please log in again.');
      throw new Error('User information is missing!');
    }

    const parsedUser = JSON.parse(user);
    const token = parsedUser?.token;

    if (!token) {
      console.error('Authorization token is missing! Please log in again.');
      throw new Error('Authorization token is missing!');
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
  private handleError(error: any): Observable<never> {
    if (error.status === 400 && error.error.message) {
      return throwError(() => new Error(error.error.message)); // Pass the backend error message
    }
    if (error.status === 403) {
      return throwError(
        () => new Error('You do not have permission to perform this action.')
      );
    }
    return throwError(
      () =>
        new Error(
          error.message || 'Something went wrong, please try again later.'
        )
    );
  }
}
