import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  private themeSubscription!: Subscription;

  constructor(private router: Router, private themeService: ThemeService) {}

  ngOnInit(): void {
    // Check if JWT token exists in localStorage
    const token = localStorage.getItem('token');
    
    // If no token, redirect to login page
    if (!token) {
      this.router.navigate(['/login']);
    }

    // Subscribe to the theme service
    this.themeSubscription = this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
