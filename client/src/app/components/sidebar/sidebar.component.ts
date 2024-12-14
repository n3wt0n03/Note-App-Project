import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit, OnDestroy {
  isExpanded: boolean = false;
  isDarkMode: boolean = false;
  private themeSubscription!: Subscription;

  constructor(private router: Router, private themeService: ThemeService) {}

  ngOnInit() {
    this.themeSubscription = this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
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
