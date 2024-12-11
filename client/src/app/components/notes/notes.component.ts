import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { ThemeService } from '../../services/theme.service';
import { Note } from '../../model/note.model';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes.component.html',
})
export class NotesComponent implements OnInit {
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

  currentNote: Note = this.createEmptyNote();

  constructor(private noteService: NoteService, private themeService: ThemeService) {}

  ngOnInit() {
    this.loadNotes();
    this.themeService.isDarkMode$.subscribe(isDark => {
      // The setDarkMode method is now handled by the ThemeService
    });
  }

  // Remove toggleDarkMode and setDarkMode methods as they're now handled by ThemeService

  loadNotes(): void {
    this.noteService.getNotes().subscribe({
      next: (data) => {
        this.notes = data;
        this.filteredNotes = [...this.notes];
      },
      error: (error) => {
        console.error('Failed to load notes', error);
      },
    });
  }

  openAddNoteModal(): void {
    this.isEditing = false;
    this.currentNote = this.createEmptyNote();
    this.isModalOpen = true;
  }

  openEditNoteModal(note: Note): void {
    this.isEditing = true;
    this.editNoteId = note.id ?? null;
    this.currentNote = { ...note };
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
          this.notes = this.notes.filter((note) => note.id !== idToDelete);
          this.filteredNotes = this.filteredNotes.filter(
            (note) => note.id !== idToDelete
          );
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Failed to delete note', error);
          alert('Failed to delete note: ' + (error.message || 'Unknown error'));
          this.closeDeleteModal();
        },
      });
    }
  }

  saveNote(): void {
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
    };
  }
}
