import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  constructor(private router: Router, public themeService: ThemeService) {}

  // Simulated user data
  user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'user@example.com',
  };

  // Modal Variables
  isModalOpen = false;
  isChangingPassword = false;
  modalTitle = '';
  oldPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  
  // User data
  displayName = 'John Doe';
  username = 'John';
  bio = 'Bio test 123';
  phoneNumber = '123-456-789';

  ngOnInit() {
    // Initialization logic if needed
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  // Modal handling methods
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

  saveChanges() {
    if (this.isChangingPassword) {
      console.log('Password Changed');
    } else {
      console.log('Profile Updated:', {
        displayName: this.displayName,
        username: this.username,
        bio: this.bio,
        phoneNumber: this.phoneNumber,
      });
    }
    this.closeModal();
  }

  // Email handling methods
  rawEmail: string = this.user.email;
  emailDisplay: string = this.censorEmail(this.rawEmail);
  
  censorEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    const maskedLocal = '*'.repeat(localPart.length);
    return `${maskedLocal}@${domain}`;
  }

  revealButtonText: string = 'Reveal';

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
    sessionStorage.clear();
    localStorage.clear();
    console.log('User has been logged out. Tokens cleared from storage.');
    this.router.navigate(['/login']);
  }
}
