import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../model/note.model'; // Ensure the correct path to your Note model

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private apiUrl = 'http://localhost:8080/api/notes';

  constructor(private http: HttpClient) {}

  // Get all notes for a specific user
  getNotesByUser(userId: number): Observable<Note[]> {
    const headers = this.getHeaders();
    return this.http.get<Note[]>(`${this.apiUrl}/${userId}`, { headers });
  }

  // Get a specific note by its ID
  getNoteById(id: number): Observable<Note> {
    const headers = this.getHeaders();
    return this.http.get<Note>(`${this.apiUrl}/${id}`, { headers });
  }

  // Create a new note for the authenticated user
  createNote(userId: number, note: Note): Observable<Note> {
    const headers = this.getHeaders();
    return this.http.post<Note>(`${this.apiUrl}/${userId}`, note, { headers });
  }

  // Update an existing note by its ID
  updateNote(id: number, note: Note): Observable<Note> {
    const headers = this.getHeaders();
    return this.http.put<Note>(`${this.apiUrl}/${id}`, note, { headers });
  }

  // Delete a note by its ID
  deleteNote(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  // Helper method to get headers with token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Add the token to the Authorization header
    });
  }
}
