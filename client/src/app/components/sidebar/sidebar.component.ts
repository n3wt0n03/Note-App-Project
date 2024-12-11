import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  isExpanded: boolean = false;
  isDarkMode: boolean = false;

  constructor(private router: Router, private themeService: ThemeService) {
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

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
