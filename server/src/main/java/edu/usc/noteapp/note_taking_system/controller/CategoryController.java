package edu.usc.noteapp.note_taking_system.controller;

import edu.usc.noteapp.note_taking_system.model.Category;
import edu.usc.noteapp.note_taking_system.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        System.out.println("Received category: " + category);
        return ResponseEntity.ok(categoryService.createCategory(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        return ResponseEntity.ok(categoryService.updateCategory(id, category));
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
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
