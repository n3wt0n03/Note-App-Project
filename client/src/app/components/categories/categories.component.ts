import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CategoryService } from '../../services/category.service';
import { NoteService } from '../../services/note.service';
import { Category } from '../../model/category.model';
import { Note } from '../../model/note.model';

@Component({
  selector: 'app-categories',
  standalone: true, // Make it standalone
  imports: [CommonModule, FormsModule, DragDropModule], // Import DragDropModule
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = []; // List of categories
  notes: Note[] = []; // Notes for the selected category
  isCategoryModalOpen = false; // Modal visibility state
  isDeleteConfirmationOpen = false; // Delete confirmation modal visibility state
  isSettingsOpen = false; // Settings modal visibility state
  currentCategory: Category = this.createEmptyCategory();
  selectedCategory: Category | null = null; // Currently selected category
  categoryToDeleteId: number | null = null; // ID of the category to delete
  categoryErrorMessage: string | null = null; // Variable to store error message

  constructor(
    private categoryService: CategoryService,
    private noteService: NoteService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // Load all categories
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.sort(
          (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
        );
      },
      error: (err) => console.error('Failed to load categories:', err),
    });
  }

  // Select a category and load its notes
  selectCategory(category: Category): void {
    this.selectedCategory = category;
    if (category.id !== undefined && category.id !== null) {
      this.loadNotes(category.id);
    } else {
      this.notes = []; // Clear notes if category ID is invalid
    }
  }

  // Load notes for a specific category
  loadNotes(categoryId: number): void {
    this.noteService.getNotesByCategoryId(categoryId).subscribe({
      next: (data) => {
        // Extract 'id' from 'category' for comparison
        this.notes = data.filter((note) => {
          const category = note.category;
          return (
            category !== null &&
            (typeof category === 'number' ? category : category.id) ===
              categoryId
          );
        });
      },
      error: (err) => console.error('Failed to load notes:', err),
    });
  }

  // Open modal for adding a new category
  openAddCategoryModal(): void {
    this.currentCategory = this.createEmptyCategory();
    this.isCategoryModalOpen = true;
  }

  // Open modal for editing an existing category
  editCategory(category: Category | null): void {
    if (!category) {
      console.error('No category selected for editing.');
      return;
    }
    this.currentCategory = { ...category }; // Clone the category to avoid mutating directly
    this.isCategoryModalOpen = true;
    this.isSettingsOpen = false; // Close settings modal
  }

  // Close the category modal
  closeCategoryModal(): void {
    this.isCategoryModalOpen = false;
  }

  // Toggle settings modal
  toggleSettings(): void {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  // Open delete confirmation modal
  confirmDeleteCategory(id: number | null | undefined): void {
    if (id == null) {
      console.error('Category ID is null or undefined.');
      return;
    }
    this.categoryToDeleteId = id;
    this.isDeleteConfirmationOpen = true;
    this.isSettingsOpen = false; // Close settings modal
  }

  // Close delete confirmation modal
  closeDeleteConfirmation(): void {
    this.isDeleteConfirmationOpen = false;
    this.categoryToDeleteId = null;
  }

  // Confirm deletion of a category
  confirmDelete(): void {
    if (this.categoryToDeleteId == null) {
      console.error('No category ID set for deletion.');
      return;
    }

    this.categoryService.deleteCategory(this.categoryToDeleteId).subscribe({
      next: () => {
        this.loadCategories();
        if (this.selectedCategory?.id === this.categoryToDeleteId) {
          this.selectedCategory = null;
          this.notes = [];
        }
        this.closeDeleteConfirmation();
      },
      error: (err) => console.error('Failed to delete category:', err),
    });
  }

  // Save a new or updated category
  saveCategory(): void {
    this.categoryErrorMessage = null; // Clear previous errors
  
    if (this.currentCategory.id) {
      // Update existing category
      this.categoryService
        .updateCategory(this.currentCategory.id, this.currentCategory)
        .subscribe({
          next: () => {
            this.loadCategories();
            this.closeCategoryModal();
          },
          error: (err) => {
            if (err.error && err.error.message) {
              this.categoryErrorMessage = err.error.message; // Use backend error message
            } else {
              this.categoryErrorMessage =
                'Failed to update category. Please try again.';
            }
            console.error('Failed to update category:', err);
          },
        });
    } else {
      // Create a new category
      this.categoryService.createCategory(this.currentCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.closeCategoryModal();
        },
        error: (err) => {
          if (
            err.error &&
            err.error.message &&
            err.error.message.includes('already exists')
          ) {
            this.categoryErrorMessage = 'This category name already exists.';
          } else {
            this.categoryErrorMessage =
              'This category name already exists.';
          }
          console.error('Failed to create category:', err);
        },
      });
    }
  }
  
  // Handle drag-and-drop to reorder categories
  onDrop(event: CdkDragDrop<Category[]>): void {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);

    // Extract ordered category IDs
    const orderedCategoryIds: number[] = this.categories
      .filter((category) => category.id !== null)
      .map((category) => category.id as number);

    // Send updated order to backend
    this.categoryService.reorderCategories(orderedCategoryIds).subscribe({
      next: () => console.log('Categories reordered successfully'),
      error: (err) => console.error('Failed to reorder categories:', err),
    });
  }

  // Create an empty category object
  private createEmptyCategory(): Category {
    return {
      id: null,
      name: '',
      color: '#ffffff',
    };
  }

  // Utility function to determine contrast color for text
  getContrastColor(hexColor: string): string {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? '#000000' : '#ffffff';
  }
}
