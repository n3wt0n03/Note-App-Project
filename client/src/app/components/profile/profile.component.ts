import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NoteService } from '../../services/note.service';
import { User } from '../../model/user.model';
import { Note } from '../../model/note.model';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

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

  rawEmail: string = '';
  emailDisplay: string = '';
  revealButtonText: string = '<i class="fa fa-eye" aria-hidden="true"></i>';

  oldPassword = '';
  newPassword = '';
  confirmNewPassword = '';

  displayName = '';
  username = '';
  bio = '';
  phoneNumber = '';

  isDarkMode: boolean = false;
  private themeSubscription: Subscription;

  constructor(
    private userService: UserService,
    private noteService: NoteService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.themeSubscription = this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        this.userId = parsedUser.id;
        this.fetchUserProfile();
        this.fetchUserNotes();
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
      }
    } else {
      console.error('No user data found in localStorage');
    }
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  fetchUserNotes(): void {
    if (this.userId === null) {
      console.error('User ID is not available for fetching notes');
      return;
    }

    this.noteService.getNotes().subscribe(
      (notes) => {
        this.notes = notes;
        this.sortNotesByDate();
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
    this.notes.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    this.filteredNotes = [...this.notes];
  }

  censorEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    const maskedLocal = '*'.repeat(localPart.length);
    return `${maskedLocal}@${domain}`;
  }

  saveChanges() {
    if (this.isChangingPassword) {
      console.log('Change password logic here');
    } else {
      const updatedUser: User = {
        id: this.userId!,
        username: this.username,
        email: this.user?.email ?? '',
        firstName: this.displayName.split(' ')[0],
        lastName: this.displayName.split(' ')[1],
        bio: this.bio,
        phoneNumber: this.phoneNumber,
        password: '',
      };

      this.userService.updateUserProfile(this.userId!, updatedUser).subscribe(
        (updated) => {
          alert('Profile updated successfully');
          this.user = updated;
          localStorage.setItem('user', JSON.stringify(updated));
          this.cdr.detectChanges();
        },
        (error) => alert('Error updating profile: ' + error.message)
      );
    }
    this.closeModal();
  }

  openModal(type: number) {
    this.isModalOpen = true;
    this.isChangingPassword = type === 1;
    this.modalTitle = type === 1 ? 'Change Password' : 'Edit Profile';
  }

  closeModal() {
    this.isModalOpen = false;
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
    sessionStorage.clear();
    localStorage.clear();
    console.log('User has been logged out. Tokens cleared from storage.');
    this.router.navigate(['/login']);
  }
}
