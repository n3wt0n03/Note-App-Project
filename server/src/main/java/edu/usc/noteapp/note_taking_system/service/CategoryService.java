package edu.usc.noteapp.note_taking_system.service;

import edu.usc.noteapp.note_taking_system.model.Category;
import edu.usc.noteapp.note_taking_system.repository.CategoryRepository;
import edu.usc.noteapp.note_taking_system.repository.NoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final NoteRepository noteRepository;

    public CategoryService(CategoryRepository categoryRepository, NoteRepository noteRepository) {
        this.categoryRepository = categoryRepository;
        this.noteRepository = noteRepository;
    }

    public void updateNotesCount(Long categoryId) {
        int count = noteRepository.countByCategoryId(categoryId);
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setNotesCount(count);
        categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(Category category) {
        if (category.getId() != null) {
            throw new IllegalArgumentException("New category must not have an ID.");
        }
        return categoryRepository.save(category);
    }


    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + categoryId));
    }

    public Category updateCategory(Long categoryId, Category category) {
        Category existingCategory = getCategoryById(categoryId);
        existingCategory.setName(category.getName());
        existingCategory.setColor(category.getColor());
        existingCategory.setNotesCount(category.getNotesCount());
        return categoryRepository.save(existingCategory);
    }

    public void deleteCategory(Long categoryId) {
        categoryRepository.deleteById(categoryId);
    }


}
