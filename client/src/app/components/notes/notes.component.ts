import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { Note } from '../../model/note.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotesEditableValueDirective } from './notes-editable-value.directive';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, NotesEditableValueDirective],
  templateUrl: './notes.component.html',
})
export class NotesComponent {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  searchTerm: string = '';
  sortOrder: string = 'latest';
  isModalOpen = false;
  isViewModalOpen = false;
  isDeleteModalOpen = false;
  isEditing = false;
  editNoteId: number | null = null;
  selectedNote: Note | null = null;
  noteToDelete: Note | null = null;
  noteColor: string = '#ffffff';
  predefinedColors: string[] = ['#ffffff', '#08b6db', '#daae61',  '#c3ce7b','#e1bee7'];

  currentNote: Note = this.createEmptyNote();

  constructor(
    private noteService: NoteService,
    private sanitizer: DomSanitizer
  ) {
    this.loadNotes();
  }

  loadNotes(): void {
    this.noteService.getNotes().subscribe({
      next: (data) => {
        this.notes = data;
        this.filteredNotes = [...this.notes];
      },
      error: (error) => console.error('Failed to load notes', error),
    });
  }

  openAddNoteModal(): void {
    this.isEditing = false;
    this.currentNote = this.createEmptyNote();
    this.noteColor = '#ffffff';
    this.isModalOpen = true;
  }

  openEditNoteModal(note: Note): void {
    this.isEditing = true;
    this.editNoteId = note.id ?? null;
    this.currentNote = { ...note };
    this.noteColor = note.color ?? '#ffffff';
    this.isModalOpen = true;
  }

  openViewModal(note: Note): void {
    this.selectedNote = note;
    this.isViewModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditing = false;
    this.editNoteId = null;
  }

  closeViewModal(): void {
    this.isViewModalOpen = false;
    this.selectedNote = null;
  }

  openDeleteModal(note: Note): void {
    this.noteToDelete = note;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.noteToDelete = null;
  }
  confirmDelete(): void {
    if (this.noteToDelete && this.noteToDelete.id) {
      const idToDelete = this.noteToDelete.id;
      this.noteService.deleteNote(idToDelete).subscribe({
        next: () => {
          // Remove the deleted note from the local arrays
          this.notes = this.notes.filter((note) => note.id !== idToDelete);
          this.filteredNotes = this.filteredNotes.filter(
            (note) => note.id !== idToDelete
          );
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Failed to delete note:', error);
          alert('Failed to delete note. Please try again.');
          this.closeDeleteModal();
        },
      });
    }
  }

  saveNote(): void {
    this.currentNote.color = this.noteColor;
    if (this.isEditing && this.editNoteId !== null) {
      this.noteService.updateNote(this.editNoteId, this.currentNote).subscribe({
        next: () => {
          this.loadNotes();
          this.closeModal();
        },
        error: (error) => console.error('Failed to update note', error),
      });
    } else {
      const newNote = { ...this.currentNote, id: undefined };
      this.noteService.createNote(newNote).subscribe({
        next: () => {
          this.loadNotes();
          this.closeModal();
        },
        error: (error) => console.error('Failed to create note', error),
      });
    }
  }

  setNoteColor(color: string): void {
    this.noteColor = color;
  }

  onColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      this.setNoteColor(input.value);
    }
  }

  filterNotes(): void {
    this.filteredNotes = this.notes.filter((note) =>
      note.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sortNotes();
  }

  sortNotes(): void {
    if (this.sortOrder === 'latest') {
      this.filteredNotes.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (this.sortOrder === 'oldest') {
      this.filteredNotes.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }
  }

  private createEmptyNote(): Note {
    return {
      id: 0,
      title: '',
      category: 'Study',
      description: '',
      date: new Date().toISOString().split('T')[0],
      color: '#ffffff',
    };
  }

  applyFormatting(format: string): void {
    document.execCommand(format, false, '');
  }

  isActive(format: string): boolean {
    return document.queryCommandState(format);
  }

  getSanitizedDescription(description: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(description);
  }
}
