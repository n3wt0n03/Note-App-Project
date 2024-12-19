import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { CategoryService } from '../../services/category.service'; // Added CategoryService
import { ThemeService } from '../../services/theme.service';
import { Note } from '../../model/note.model';
import { Category } from '../../model/category.model';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotesEditableValueDirective } from './notes-editable-value.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, NotesEditableValueDirective],
  templateUrl: './notes.component.html',
})
export class NotesComponent implements OnInit, OnDestroy {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  categories: Category[] = []; // Store fetched categories
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
  predefinedColors: string[] = [
    '#ffffff',
    '#08b6db',
    '#daae61',
    '#c3ce7b',
    '#e1bee7',
  ];

  currentNote: Note = this.createEmptyNote();
  themeSubscription!: Subscription;
  isDarkMode: boolean = false;

  constructor(
    
    private noteService: NoteService,
    private categoryService: CategoryService, // Injected CategoryService
    
    private sanitizer: DomSanitizer
  ,
    private themeService: ThemeService
  ) {
    this.loadNotes();
  }
  ngOnInit() {
    this.themeSubscription = this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
    this.loadCategories();
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
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

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        console.log('Loaded categories:', categories); // Debug log
        this.categories = categories;
      },
      error: (error) => console.error('Failed to load categories:', error)
    });
  }
  getCategoryNameById(category: Category | { id: number } | null): string {
    if (!category) {
      return 'Uncategorized';
    }
    
    // If it's a full Category object
    if ('name' in category) {
      return category.name;
    }
    
    // If it's just an ID reference, look up the category name
    const categoryData = this.categories.find(cat => cat.id === category.id);
    return categoryData ? categoryData.name : 'Uncategorized';
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

    if (this.currentNote.category && 'id' in this.currentNote.category) {
      const categoryId = (this.currentNote.category as { id: number }).id;
      this.currentNote.category =
        this.categories.find((category) => category.id === categoryId) || null;
    }
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
    console.log('Current note before save:', this.currentNote); // Debug log

    // First ensure we have a valid category ID
    const categoryId = this.currentNote.category 
      ? (this.currentNote.category as Category).id 
      : null;

    const noteToSave: Note = {
      title: this.currentNote.title,
      description: this.currentNote.description,
      date: new Date().toISOString().split('T')[0],
      // Only create the category object if we have a valid ID
      category: categoryId ? { id: categoryId } : null,
      color: this.noteColor || '#ffffff'
    };

    console.log('Note being saved:', noteToSave); // Debug log

    if (this.isEditing && this.editNoteId !== null) {
      this.noteService.updateNote(this.editNoteId, noteToSave).subscribe({
        next: (response) => {
          console.log('Update successful:', response);
          this.loadNotes();
          this.closeModal();
        },
        error: (error) => {
          console.error('Failed to update note:', error);
          console.error('Error details:', error.error);
        },
      });
    } else {
      this.noteService.createNote(noteToSave).subscribe({
        next: (response) => {
          console.log('Create successful:', response);
          this.loadNotes();
          this.closeModal();
        },
        error: (error) => {
          console.error('Failed to create note:', error);
          if (error.error) {
            console.error('Error details:', error.error);
          }
        },
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
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: null,
      color: '#ffffff'
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
