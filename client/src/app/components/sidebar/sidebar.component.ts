import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  isExpanded: boolean = false;

  constructor(private router: Router) {}

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
