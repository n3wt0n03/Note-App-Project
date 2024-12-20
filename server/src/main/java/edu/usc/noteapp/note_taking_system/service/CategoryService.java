package edu.usc.noteapp.note_taking_system.service;

import edu.usc.noteapp.note_taking_system.model.Category;
import edu.usc.noteapp.note_taking_system.model.Note;
import edu.usc.noteapp.note_taking_system.model.User;
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
        throw new UnsupportedOperationException("Use getAllCategoriesOrderedForUser(User user) instead");
    }

    public List<Category> getAllCategoriesOrderedForUser(User user) {
        return categoryRepository.findAllByUserOrderByOrderIndexAsc(user);
    }

    public void updateCategoryOrder(Long categoryId, Integer newIndex) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with ID: " + categoryId));

        category.setOrderIndex(newIndex);
        categoryRepository.save(category);

        List<Category> categories = categoryRepository.findAllByUserOrderByOrderIndexAsc(category.getUser());
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

        Optional<Category> existingCategory = categoryRepository.findByNameAndUser(category.getName().trim(), category.getUser());
        if (existingCategory.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A category with this name already exists.");
        }

        int maxOrderIndex = categoryRepository.findMaxOrderIndexByUser(category.getUser()).orElse(0);
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

        Optional<Category> duplicateCategory = categoryRepository.findByNameAndUser(category.getName().trim(), existingCategory.getUser());
        if (duplicateCategory.isPresent() && !duplicateCategory.get().getId().equals(categoryId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A category with this name already exists.");
        }

        existingCategory.setName(category.getName());
        existingCategory.setColor(category.getColor());
        existingCategory.setNotesCount(category.getNotesCount());
        return categoryRepository.save(existingCategory);
    }

    public void deleteCategory(Long categoryId) {
        Category categoryToDelete = getCategoryById(categoryId);

        // Get the user from the category to be deleted
        User user = categoryToDelete.getUser();

        // Find or create Uncategorized for this user
        Category uncategorized = categoryRepository.findByNameAndUser("Uncategorized", user)
                .orElseGet(() -> {
                    Category newUncategorized = new Category();
                    newUncategorized.setName("Uncategorized");
                    newUncategorized.setColor("#FFFFFF");
                    newUncategorized.setOrderIndex(0);
                    newUncategorized.setUser(user);
                    return categoryRepository.save(newUncategorized);
                });

        // Prevent deletion of "Uncategorized"
        if ("Uncategorized".equalsIgnoreCase(categoryToDelete.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Uncategorized' category cannot be deleted.");
        }

        // Reassign notes to "Uncategorized"
        noteRepository.findByCategoryId(categoryId).forEach(note -> {
            note.setCategory(uncategorized);
            noteRepository.save(note);
        });

        // Update notes count for "Uncategorized"
        updateNotesCount(uncategorized.getId());

        // Delete the category
        categoryRepository.deleteById(categoryId);

        // Reorder remaining categories
        List<Category> categories = categoryRepository.findAllByUserOrderByOrderIndexAsc(user);
        for (int i = 0; i < categories.size(); i++) {
            Category category = categories.get(i);
            category.setOrderIndex(i);
            categoryRepository.save(category);
        }
    }

    public void updateNoteCategory(Long noteId, Long newCategoryId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found with ID: " + noteId));

        // Update the category of the note
        Category oldCategory = note.getCategory();
        Category newCategory = categoryRepository.findById(newCategoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with ID: " + newCategoryId));

        note.setCategory(newCategory);
        noteRepository.save(note);

        // Update notes count for both old and new categories
        if (oldCategory != null) {
            updateNotesCount(oldCategory.getId());
        }
        updateNotesCount(newCategoryId);
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

    public Category createCategory(Category category, User user) {
        if (category.getId() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New category must not have an ID.");
        }

        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category name must not be empty.");
        }

        Optional<Category> existingCategory = categoryRepository.findByNameAndUser(category.getName().trim(), category.getUser());
        if (existingCategory.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A category with this name already exists.");
        }

        int maxOrderIndex = categoryRepository.findMaxOrderIndexByUser(category.getUser()).orElse(0);
        category.setOrderIndex(maxOrderIndex + 1);
        category.setUser(user);

        if (category.getColor() == null || category.getColor().trim().isEmpty()) {
            category.setColor("#FFFFFF");
        }

        return categoryRepository.save(category);
    }
}
