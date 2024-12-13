package edu.usc.noteapp.note_taking_system.service;

import edu.usc.noteapp.note_taking_system.model.Note;
import edu.usc.noteapp.note_taking_system.model.Category;
import edu.usc.noteapp.note_taking_system.repository.NoteRepository;
import edu.usc.noteapp.note_taking_system.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final CategoryRepository categoryRepository;

    public NoteService(NoteRepository noteRepository, CategoryRepository categoryRepository) {
        this.noteRepository = noteRepository;
        this.categoryRepository = categoryRepository;
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
        // Set to "Uncategorized" if no category is provided
        if (note.getCategory() == null) {
            Category uncategorized = getOrCreateUncategorizedCategory();
            note.setCategory(uncategorized);
        } else {
            // Validate category if provided
            Category category = categoryRepository.findById(note.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + note.getCategory().getId()));
            note.setCategory(category);
        }

        Note savedNote = noteRepository.save(note);

        // Update notes count for the associated category
        updateNotesCount(note.getCategory().getId());

        return savedNote;
    }

    // Update an existing note
    public Note updateNote(Long noteId, Note updatedNote) {
        return noteRepository.findById(noteId).map(existingNote -> {
            // Save the current category ID for later comparison
            Long oldCategoryId = existingNote.getCategory() != null ? existingNote.getCategory().getId() : null;

            existingNote.setTitle(updatedNote.getTitle());
            existingNote.setDescription(updatedNote.getDescription());
            existingNote.setDate(updatedNote.getDate());
            existingNote.setColor(updatedNote.getColor());

            // Validate and update category or set to "Uncategorized" if none provided
            if (updatedNote.getCategory() != null) {
                Category category = categoryRepository.findById(updatedNote.getCategory().getId())
                        .orElseThrow(() -> new RuntimeException("Category not found with ID: " + updatedNote.getCategory().getId()));
                existingNote.setCategory(category);
            } else {
                Category uncategorized = getOrCreateUncategorizedCategory();
                existingNote.setCategory(uncategorized);
            }

            Note savedNote = noteRepository.save(existingNote);

            // Update notes count for old and new categories
            if (oldCategoryId != null) {
                updateNotesCount(oldCategoryId);
            }
            if (existingNote.getCategory() != null) {
                updateNotesCount(existingNote.getCategory().getId());
            }

            return savedNote;
        }).orElseThrow(() -> new RuntimeException("Note not found with ID: " + noteId));
    }

    // Delete a note by ID
    public void deleteNoteById(Long noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found with ID: " + noteId));

        Long categoryId = note.getCategory() != null ? note.getCategory().getId() : null;

        noteRepository.deleteById(noteId);

        // Update notes count if category is provided
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
    private Category getOrCreateUncategorizedCategory() {
        return categoryRepository.findByName("Uncategorized")
                .orElseGet(() -> {
                    Category uncategorized = new Category();
                    uncategorized.setName("Uncategorized");
                    uncategorized.setColor("#cccccc"); // Default color
                    uncategorized.setNotesCount(0);
                    return categoryRepository.save(uncategorized);
                });
    }
}
