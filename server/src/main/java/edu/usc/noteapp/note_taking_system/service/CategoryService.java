package edu.usc.noteapp.note_taking_system.service;

import edu.usc.noteapp.note_taking_system.model.Category;
import edu.usc.noteapp.note_taking_system.repository.CategoryRepository;
import edu.usc.noteapp.note_taking_system.repository.NoteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        category.setNotesCount(count);
        categoryRepository.save(category);
    }

    public List<Category> getAllCategoriesOrdered() {
        return categoryRepository.findAllByOrderByOrderIndexAsc();
    }

    public void updateCategoryOrder(Long categoryId, Integer newIndex) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with ID: " + categoryId));

        category.setOrderIndex(newIndex);
        categoryRepository.save(category);

        List<Category> categories = categoryRepository.findAllByOrderByOrderIndexAsc();
        int currentIndex = 0;
        for (Category cat : categories) {
            if (!cat.getId().equals(categoryId)) {
                if (currentIndex == newIndex) {
                    currentIndex++; // Skip the new index for the moved category
                }
                cat.setOrderIndex(currentIndex);
                categoryRepository.save(cat);
                currentIndex++;
            }
        }
    }

    public Category createCategory(Category category) {
        if (category.getId() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New category must not have an ID.");
        }

        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category name must not be empty.");
        }

        Optional<Category> existingCategory = categoryRepository.findByName(category.getName().trim());
        if (existingCategory.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A category with this name already exists.");
        }

        int maxOrderIndex = categoryRepository.findMaxOrderIndex().orElse(0);
        category.setOrderIndex(maxOrderIndex + 1);

        if (category.getColor() == null || category.getColor().trim().isEmpty()) {
            category.setColor("#FFFFFF"); // Default color
        }

        return categoryRepository.save(category);
    }

    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with ID: " + categoryId));
    }

    public Category updateCategory(Long categoryId, Category category) {
        Category existingCategory = getCategoryById(categoryId);

        Optional<Category> duplicateCategory = categoryRepository.findByName(category.getName().trim());
        if (duplicateCategory.isPresent() && !duplicateCategory.get().getId().equals(categoryId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A category with this name already exists.");
        }

        existingCategory.setName(category.getName());
        existingCategory.setColor(category.getColor());
        existingCategory.setNotesCount(category.getNotesCount());
        return categoryRepository.save(existingCategory);
    }

    public void deleteCategory(Long categoryId) {
        categoryRepository.deleteById(categoryId);

        List<Category> categories = categoryRepository.findAllByOrderByOrderIndexAsc();
        for (int i = 0; i < categories.size(); i++) {
            Category category = categories.get(i);
            category.setOrderIndex(i);
            categoryRepository.save(category);
        }
    }

    public void reorderCategories(List<Long> orderedCategoryIds) {
        for (int i = 0; i < orderedCategoryIds.size(); i++) {
            Long categoryId = orderedCategoryIds.get(i);
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with ID: " + categoryId));
            category.setOrderIndex(i);
            categoryRepository.save(category);
        }
    }
}
