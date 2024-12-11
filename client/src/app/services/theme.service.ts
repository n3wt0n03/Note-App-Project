import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    // Initialize theme based on localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.setDarkMode(isDarkMode);
  }

  toggleDarkMode(): void {
    const currentMode = this.isDarkModeSubject.value;
    this.setDarkMode(!currentMode);
  }

  setDarkMode(isDark: boolean): void {
    this.isDarkModeSubject.next(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }
}
