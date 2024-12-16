import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit, OnDestroy implements OnInit {
  user: User | null = null;
  userId: number | null = null;
  isExpanded: boolean = false;
  displayName: string;
  isDarkMode: boolean = false;
  private themeSubscription!: Subscription;

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

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  expandSidebar(expand: boolean): void {
    this.isExpanded = expand;
  }

  logout(): void {
    console.log(
      'Before removal:',
      localStorage.getItem('token'),
      localStorage.getItem('user'),
      sessionStorage.getItem('token')
    );

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');

    console.log(
      'After removal:',
      localStorage.getItem('token'),
      localStorage.getItem('user'),
      sessionStorage.getItem('token')
    );

    this.router.navigate(['/login']);
  }
}
