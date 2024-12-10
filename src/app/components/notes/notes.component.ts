import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service'; // Ensure the path is correct
import { Note } from '../../model/note.model'; // Define Note model separately

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes.component.html',
})
export class NotesComponent {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  searchTerm: string = '';
  sortOrder: string = 'latest';
  isModalOpen = false;
  isViewModalOpen = false;
  isEditing = false;
  editNoteId: number | null = null;
  selectedNote: Note | null = null;

  currentNote: Note = this.createEmptyNote();

  constructor(private noteService: NoteService) {
    this.loadNotes();
  }

  loadNotes(): void {
    this.noteService.getNotesByUser(1).subscribe(
      (data) => {
        this.notes = data;
        this.filteredNotes = [...this.notes];
      },
      (error) => {
        console.error('Failed to load notes', error);
      }
    );
  }

  openAddNoteModal(): void {
    this.isEditing = false;
    this.currentNote = this.createEmptyNote();
    this.isModalOpen = true;
  }

  openEditNoteModal(note: Note): void {
    this.isEditing = true;
    this.editNoteId = note.id;
    this.currentNote = { ...note };
    this.isModalOpen = true;
  }

  openViewModal(note: Note): void {
    this.selectedNote = note;
    this.isViewModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  closeViewModal(): void {
    this.isViewModalOpen = false;
    this.selectedNote = null;
  }

  saveNote(): void {
    if (this.isEditing && this.editNoteId !== null) {
      this.noteService.updateNote(this.editNoteId, this.currentNote).subscribe(
        () => {
          this.loadNotes();
          this.closeModal();
        },
        (error) => console.error('Failed to update note', error)
      );
    } else {
      this.noteService.createNote(1, this.currentNote).subscribe(
        () => {
          this.loadNotes();
          this.closeModal();
        },
        (error) => console.error('Failed to create note', error)
      );
    }
  }

  deleteNote(id: number): void {
    this.noteService.deleteNote(id).subscribe(
      () => this.loadNotes(),
      (error) => console.error('Failed to delete note', error)
    );
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
