import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if JWT token exists in localStorage
    const token = localStorage.getItem('token');
    
    // If no token, redirect to login page
    if (!token) {
      this.router.navigate(['/login']);
    }
  }
}
