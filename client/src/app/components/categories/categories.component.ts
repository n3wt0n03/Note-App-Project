import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../model/category.model';

@Component({
  selector: 'app-categories',
  standalone: true, // Make it standalone
  imports: [CommonModule, FormsModule], // Import CommonModule and FormsModule
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = []; // List of categories
  isCategoryModalOpen = false; // Modal visibility state
  currentCategory: Category = this.createEmptyCategory();

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // Load all categories
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Failed to load categories:', err),
    });
  }

  // Open modal for adding a new category
  openAddCategoryModal(): void {
    this.currentCategory = this.createEmptyCategory();
    this.isCategoryModalOpen = true;
  }

  // Close the category modal
  closeCategoryModal(): void {
    this.isCategoryModalOpen = false;
  }

  // Save a new or updated category
  saveCategory(): void {
    if (this.currentCategory.id) {
      // Update existing category
      this.categoryService
        .updateCategory(this.currentCategory.id, this.currentCategory)
        .subscribe({
          next: () => {
            this.loadCategories();
            this.closeCategoryModal();
          },
          error: (err) => console.error('Failed to update category:', err),
        });
    } else {
      // Set id as null for new categories
      const newCategory = { ...this.currentCategory, id: null };
      this.categoryService.createCategory(newCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.closeCategoryModal();
        },
        error: (err) => console.error('Failed to create category:', err),
      });
    }
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
