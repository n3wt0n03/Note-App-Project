package edu.usc.noteapp.note_taking_system.controller;

import edu.usc.noteapp.note_taking_system.model.Category;
import edu.usc.noteapp.note_taking_system.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategoriesOrdered());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        try {
            System.out.println("Received category: " + category);
            return ResponseEntity.ok(categoryService.createCategory(category));
        } catch (ResponseStatusException e) {
            // Return error with appropriate status code and message
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            // General exception handler
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        try {
            return ResponseEntity.ok(categoryService.updateCategory(id, category));
        } catch (ResponseStatusException e) {
            // Return error with appropriate status code and message
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            // General exception handler
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @PutMapping("/{id}/order")
    public ResponseEntity<Void> updateCategoryOrder(@PathVariable Long id, @RequestBody Integer newIndex) {
        categoryService.updateCategoryOrder(id, newIndex);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorderCategories(@RequestBody List<Long> orderedCategoryIds) {
        categoryService.reorderCategories(orderedCategoryIds);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            Category category = categoryService.getCategoryById(id);
            if ("Uncategorized".equalsIgnoreCase(category.getName())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The 'Uncategorized' category cannot be deleted.");
            }
            categoryService.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (ResponseStatusException e) {
            // Return error with appropriate status code and message
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            // General exception handler
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

}
