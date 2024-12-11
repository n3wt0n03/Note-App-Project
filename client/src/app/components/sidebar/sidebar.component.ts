import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  user: User | null = null;
  userId: number | null = null;
  isExpanded: boolean = false;
  displayName: string;

  constructor(private router: Router, private userService: UserService) {
    this.displayName = '';
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData); // Parse the JSON string
        this.userId = parsedUser.id; // Extract and assign the user ID
        this.fetchUserProfile(); // Fetch the user profile
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
      }
    } else {
      console.error('No user data found in localStorage');
    }
  }

  fetchUserProfile() {
    if (this.userId === null) {
      console.error('User ID is not available');
      return;
    }
    this.userService.getUserProfile(this.userId).subscribe(
      (user) => {
        this.user = user;
        this.displayName = `${user.firstName} ${user.lastName}`;
      },
      (error) => console.error('Failed to fetch user profile:', error)
    );
  }

  // Toggles sidebar expansion when clicking the button
  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }

  // Checks if a route is active
  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  // Expands or collapses sidebar based on hover
  expandSidebar(expand: boolean): void {
    this.isExpanded = expand;
  }

  // Logs out the user
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
