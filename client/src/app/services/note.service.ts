import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Note } from '../model/note.model'; // Ensure the correct path to your Note model

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private apiUrl = 'http://localhost:8080/api/notes';

  constructor(private http: HttpClient) {}

  // Get all notes for the authenticated user
  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Get a specific note by its ID
  getNoteById(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Create a new note for the authenticated user
  createNote(note: Note): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Update an existing note by its ID
  updateNote(id: number, note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${id}`, note, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Delete a note by its ID
  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Helper method to get headers with token
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
    return throwError(() => new Error(error.message || 'Something went wrong, please try again later.'));
  }
}
