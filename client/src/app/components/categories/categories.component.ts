import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CategoryService } from '../../services/category.service';
import { NoteService } from '../../services/note.service';
import { ThemeService } from '../../services/theme.service';
import { Category } from '../../model/category.model';
import { Note } from '../../model/note.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  notes: Note[] = [];
  isCategoryModalOpen = false;
  isDeleteConfirmationOpen = false;
  isSettingsOpen = false;
  currentCategory: Category = this.createEmptyCategory();
  selectedCategory: Category | null = null;
  categoryToDeleteId: number | null = null;
  categoryErrorMessage: string | null = null;
  isDarkMode: boolean = false;
  private themeSubscription: Subscription;

  constructor(
    private categoryService: CategoryService,
    private noteService: NoteService,
    private themeService: ThemeService
  ) {
    this.themeSubscription = this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

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

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    if (category.id !== undefined && category.id !== null) {
      this.loadNotes(category.id);
    } else {
      this.notes = [];
    }
  }

  loadNotes(categoryId: number): void {
    this.noteService.getNotesByCategoryId(categoryId).subscribe({
      next: (data) => {
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

  openAddCategoryModal(): void {
    this.categoryErrorMessage = null;
    this.currentCategory = this.createEmptyCategory();
    this.isCategoryModalOpen = true;
  }

  editCategory(category: Category | null): void {
    this.categoryErrorMessage = null;
    if (!category) {
      console.error('No category selected for editing.');
      return;
    }
    this.currentCategory = { ...category };
    this.isCategoryModalOpen = true;
    this.isSettingsOpen = false;
  }

  closeCategoryModal(): void {
    this.isCategoryModalOpen = false;
  }

  toggleSettings(): void {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  confirmDeleteCategory(
    id: number | null | undefined,
    categoryName: string
  ): void {
    if (categoryName === 'Uncategorized') {
      console.error('The "Uncategorized" category cannot be deleted.');
      this.categoryErrorMessage =
        'The "Uncategorized" category cannot be deleted.';
      return;
    }

    if (id == null) {
      console.error('Category ID is null or undefined.');
      return;
    }

    this.categoryToDeleteId = id;
    this.isDeleteConfirmationOpen = true;
    this.isSettingsOpen = false;
  }

  closeDeleteConfirmation(): void {
    this.isDeleteConfirmationOpen = false;
    this.categoryToDeleteId = null;
  }

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

  saveCategory(): void {
    this.categoryErrorMessage = null;

    if (this.currentCategory.id) {
      this.categoryService
        .updateCategory(this.currentCategory.id, this.currentCategory)
        .subscribe({
          next: () => {
            this.loadCategories();
            this.closeCategoryModal();
          },
          error: (err) => {
            this.categoryErrorMessage = `Failed to update category: ${
              err.message || 'Please try again.'
            }`;
          },
        });
    } else {
      this.categoryService.createCategory(this.currentCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.closeCategoryModal();
        },
        error: (err) => {
          this.categoryErrorMessage = `Failed to create category: ${
            err.message || 'Please try again.'
          }`;
        },
      });
    }
  }

  onDrop(event: CdkDragDrop<Category[]>): void {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);

    const orderedCategoryIds: number[] = this.categories
      .filter((category) => category.id !== null)
      .map((category) => category.id as number);

    this.categoryService.reorderCategories(orderedCategoryIds).subscribe({
      error: (err) => console.error('Failed to reorder categories:', err),
    });
  }

  private createEmptyCategory(): Category {
    return {
      id: null,
      name: '',
      color: '#ffffff',
    };
  }

  getContrastColor(hexColor: string): string {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? '#000000' : '#ffffff';
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
