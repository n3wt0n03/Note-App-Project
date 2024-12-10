import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for directives like *ngFor and ngStyle

@Component({
  selector: 'app-newnote',
  standalone: true,
  imports: [CommonModule], // Import CommonModule
  templateUrl: './newnote.component.html',
  styleUrls: ['./newnote.component.css']
})
export class NewnoteComponent {
  noteColor: string = '#ffffff'; // Default note color
  predefinedColors: string[] = ['#ff69b4', '#ff0000', '#1e90ff', '#ffff00', '#32cd32']; // Predefined colors for the note
  activeCommands: Set<string> = new Set(); // Keep track of active toolbar commands

  // Toggle between bold, italic, underline, and strikethrough
  applyFormatting(command: string): void {
    document.execCommand(command, false); // Apply text formatting
    this.updateActiveStates(); // Update active states for all commands
  }

  // Update active states for toolbar buttons
  updateActiveStates(): void {
    const commands = ['bold', 'italic', 'underline', 'strikethrough', 'insertUnorderedList']; // Include bullet list
    this.activeCommands.clear(); // Reset active commands
    commands.forEach((cmd) => {
      if (document.queryCommandState(cmd)) {
        this.activeCommands.add(cmd); // Add active commands
      }
    });
  }

  // Check if the command is active
  isActive(command: string): boolean {
    return document.queryCommandState(command);
  }

  // Toggle bullet list formatting
  toggleBulletList(): void {
    document.execCommand('insertUnorderedList', false); // Toggle bullet list
    this.updateActiveStates(); // Update active states
  }

  // Set the background color of the note
  setNoteColor(color: string | Event): void {
    if (typeof color === 'string') {
      this.noteColor = color; // Handle predefined color selection
    } else {
      const inputElement = color.target as HTMLInputElement;
      if (inputElement) {
        this.noteColor = inputElement.value; // Handle custom color selection
      }
    }
  }

  // Save the note content (console log for now)
  saveNote(): void {
    const noteContent = (document.getElementById('note') as HTMLElement).innerHTML;
    console.log('Note Content:', noteContent);
    console.log('Note Color:', this.noteColor);
    // Add save logic here (e.g., save to backend or local storage)
  }

  // Toggle between dark mode and light mode
  toggleTheme(): void {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
  }
}
