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

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }
}
