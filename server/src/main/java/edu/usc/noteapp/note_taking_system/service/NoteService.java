package edu.usc.noteapp.note_taking_system.service;

import edu.usc.noteapp.note_taking_system.model.Note;
import edu.usc.noteapp.note_taking_system.model.Category;
import edu.usc.noteapp.note_taking_system.model.User;
import edu.usc.noteapp.note_taking_system.repository.NoteRepository;
import edu.usc.noteapp.note_taking_system.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;

import java.util.List;
import java.util.Optional;
import java.util.Objects;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final CategoryRepository categoryRepository;
    private final EntityManager entityManager;

    public NoteService(NoteRepository noteRepository, CategoryRepository categoryRepository,
            EntityManager entityManager) {
        this.noteRepository = noteRepository;
        this.categoryRepository = categoryRepository;
        this.entityManager = entityManager;
    }

    // Fetch all notes for a specific user
    public List<Note> getNotesByUserId(Long userId) {
        return noteRepository.findByUserId(userId);
    }

    // Get a specific note by ID
    public Optional<Note> getNoteById(Long noteId) {
        return noteRepository.findById(noteId);
    }

    // Create a new note
    public Note createNote(Note note) {
        if (note.getCategory() == null) {
            Category uncategorized = getOrCreateUncategorizedCategory(note.getUser());
            note.setCategory(uncategorized);
        } else {
            Category category = validateCategory(note.getCategory().getId());
            note.setCategory(category);
        }

        Note savedNote = noteRepository.save(note);
        updateNotesCount(note.getCategory().getId());

        return savedNote;
    }

    // Update an existing note
    public Note updateNote(Long id, Note updatedNote) {
        Note existingNote = noteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found"));
        // Store the old category before updating
        Category oldCategory = existingNote.getCategory();
        Category newCategory = updatedNote.getCategory();
        // Update note fields
        existingNote.setTitle(updatedNote.getTitle());
        existingNote.setDescription(updatedNote.getDescription());
        existingNote.setColor(updatedNote.getColor());
        existingNote.setDate(updatedNote.getDate());
        // Handle category change
        if (newCategory != null) {
            Category category = categoryRepository.findById(newCategory.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
            existingNote.setCategory(category);
            // Increment new category count
            category.setNotesCount(category.getNotesCount() + 1);
            categoryRepository.save(category);
            // Decrement old category count if it exists
            if (oldCategory != null && !oldCategory.getId().equals(category.getId())) {
                oldCategory.setNotesCount(oldCategory.getNotesCount() - 1);
                categoryRepository.save(oldCategory);
            }
        } else {
            Category uncategorized = getOrCreateUncategorizedCategory(existingNote.getUser());
            existingNote.setCategory(uncategorized);
            // Increment uncategorized count
            uncategorized.setNotesCount(uncategorized.getNotesCount() + 1);
            categoryRepository.save(uncategorized);
            // Decrement old category count if it exists
            if (oldCategory != null && !oldCategory.getId().equals(uncategorized.getId())) {
                oldCategory.setNotesCount(oldCategory.getNotesCount() - 1);
                categoryRepository.save(oldCategory);
            }
        }
        return noteRepository.save(existingNote);
    }

    // Delete a note by ID
    public void deleteNoteById(Long noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found with ID: " + noteId));

        Long categoryId = note.getCategory() != null ? note.getCategory().getId() : null;

        noteRepository.deleteById(noteId);

        if (categoryId != null) {
            updateNotesCount(categoryId);
        }
    }

    // Update notes count for a category
    private void updateNotesCount(Long categoryId) {
        int count = noteRepository.countByCategoryId(categoryId);
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + categoryId));
        category.setNotesCount(count);
        categoryRepository.save(category);
    }

    // Get or create the "Uncategorized" category
    private Category getOrCreateUncategorizedCategory(User user) {
        return categoryRepository.findByNameAndUser("Uncategorized", user)
                .orElseGet(() -> {
                    Category uncategorized = new Category();
                    uncategorized.setUser(user);
                    uncategorized.setName("Uncategorized");
                    uncategorized.setColor("#cccccc");
                    uncategorized.setNotesCount(0);
                    uncategorized.setOrderIndex(0);
                    return categoryRepository.save(uncategorized);
                });
    }

    // Validate category existence
    private Category validateCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + categoryId));
    }
}
