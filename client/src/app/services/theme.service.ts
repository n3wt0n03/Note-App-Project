import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('dark-mode');
    if (savedTheme === 'true') {
      this.darkMode.next(true);
      document.documentElement.classList.add('dark');
    }
  }

  toggleDarkMode() {
    const isDarkMode = !this.darkMode.value;
    this.darkMode.next(isDarkMode);
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('dark-mode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('dark-mode', 'false');
    }
  }
}
