import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Required for forms binding
import { CommonModule } from '@angular/common'; // Required for *ngFor, ngStyle
import { NewnoteComponent } from './components/newnote/newnote.component'; // Import the NewnoteComponent

@Component({
  selector: 'app-root',
  standalone: true, // Indicating that this component is standalone
  imports: [CommonModule, FormsModule, NewnoteComponent], // Include NewnoteComponent here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'note-app';
  isDarkMode: boolean = false; // Default theme is light mode

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode; // Toggle the theme state
  }
}
