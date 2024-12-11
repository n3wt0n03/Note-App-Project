import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NoteService } from '../../services/note.service';
import { User } from '../../model/user.model';
import { Note } from '../../model/note.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user: User | null = null; // Holds the user data
  userId: number | null = null; // Will store the user ID dynamically
  notes: Note[] = []; // Array to store notes
  filteredNotes: Note[] = []; // Filtered notes based on search term
  isModalOpen = false;
  isChangingPassword = false;
  modalTitle = '';

  //Email toggle
  rawEmail: string = '';
  emailDisplay: string = '';
  revealButtonText: string = '<i class="fa fa-eye" aria-hidden="true"></i>';

  // Password Fields
  oldPassword = '';
  newPassword = '';
  confirmNewPassword = '';

  // Bio fields
  displayName = '';
  username = '';
  bio = '';
  phoneNumber = '';

  constructor(
    private userService: UserService,
    private noteService: NoteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Retrieve user data from local storage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData); // Parse the JSON string
        this.userId = parsedUser.id; // Extract and assign the user ID
        this.fetchUserProfile(); // Fetch the user profile
        this.fetchUserNotes(); // Fetch the user's notes
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
      }
    } else {
      console.error('No user data found in localStorage');
    }
  }

  // Fetch all notes for the authenticated user
  fetchUserNotes(): void {
    if (this.userId === null) {
      console.error('User ID is not available for fetching notes');
      return;
    }

    // Fetch all notes for the authenticated user
    this.noteService.getNotes().subscribe(
      (notes) => {
        this.notes = notes;
        this.sortNotesByDate(); // Sort the notes by latest
      },
      (error) => console.error('Failed to fetch user notes:', error)
    );
  }

  fetchUserProfile() {
    if (this.userId === null) {
      console.error('User ID is not available');
      return;
    }
    this.userService.getUserProfile(this.userId).subscribe(
      (user) => {
        this.user = user;
        this.rawEmail = user.email;
        this.emailDisplay = this.censorEmail(this.rawEmail);
        this.displayName = `${user.firstName} ${user.lastName}`;
        this.username = user.username;
        this.bio = user.bio;
        this.phoneNumber = user.phoneNumber;
      },
      (error) => console.error('Failed to fetch user profile:', error)
    );
  }

  sortNotesByDate(): void {
    // Sort notes by date in descending order (latest first)
    this.notes.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    this.filteredNotes = [...this.notes]; // Copy to filteredNotes
  }

  censorEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    const maskedLocal = '*'.repeat(localPart.length); // Replace with asterisks
    return `${maskedLocal}@${domain}`;
  }

  toggleEmail(): void {
    if (this.emailDisplay === this.censorEmail(this.rawEmail)) {
      this.emailDisplay = this.rawEmail;
      this.revealButtonText =
        '<i class="fa fa-eye-slash" aria-hidden="true"></i>';
    } else {
      this.emailDisplay = this.censorEmail(this.rawEmail);
      this.revealButtonText = 'Reveal';
    }
  }

  logout(): void {
    // Log before removal
    console.log(
      'Before removal:',
      localStorage.getItem('token'),
      localStorage.getItem('user'),
      sessionStorage.getItem('token')
    );

    // Remove JWT token and user data from localStorage and sessionStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');

    // Log after removal
    console.log(
      'After removal:',
      localStorage.getItem('token'),
      localStorage.getItem('user'),
      sessionStorage.getItem('token')
    );

    // Redirect to the login page
    this.router.navigate(['/login']);
  }
}
