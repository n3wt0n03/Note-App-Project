import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  constructor(private router: Router) {}

  // Simulated user data fetched from the server
  user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'user@example.com',
  };

  // Modal Variables
  isModalOpen = false; // Controls modal visibility
  isChangingPassword = false; // Flag to toggle between forms
  modalTitle = ''; // Title for modal
  oldPassword = '';
  newPassword = '';
  confirmNewPassword = '';

  displayName = 'John Doe';
  username = 'John';
  bio = 'Bio test 123';
  phoneNumber = '123-456-789';

  // Open the modal (1 for password change, 2 for profile edit)
  openModal(type: number) {
    this.isModalOpen = true;
    if (type === 1) {
      this.isChangingPassword = true;
      this.modalTitle = 'Change Password';
    } else if (type === 2) {
      this.isChangingPassword = false;
      this.modalTitle = 'Edit Profile';
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Save the changes (password or profile)
  saveChanges() {
    if (this.isChangingPassword) {
      console.log('Password Changed');
      // Handle password change logic here
    } else {
      console.log('Profile Updated:', {
        displayName: this.displayName,
        username: this.username,
        bio: this.bio,
        phoneNumber: this.phoneNumber,
      });
    }

    this.closeModal(); // Close the modal after saving
  }

  // Profile variables
  profileInitials: string = this.generateInitials(
    this.user.firstName,
    this.user.lastName
  );
  rawEmail: string = this.user.email;
  emailDisplay: string = this.censorEmail(this.rawEmail);
  revealButtonText: string = 'Reveal';

  // Function to generate profile initials
  generateInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }

  // Function to censor the email
  censorEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    const maskedLocal = '*'.repeat(localPart.length); // Replace with asterisks
    return `${maskedLocal}@${domain}`;
  }

  // Toggle email visibility
  toggleEmail(): void {
    if (this.emailDisplay === this.censorEmail(this.rawEmail)) {
      this.emailDisplay = this.rawEmail;
      this.revealButtonText = 'Hide';
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
