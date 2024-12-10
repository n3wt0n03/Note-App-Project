package edu.usc.noteapp.note_taking_system.service;

import edu.usc.noteapp.note_taking_system.model.Note;
import edu.usc.noteapp.note_taking_system.repository.NoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    // Get all notes for a specific user
    public List<Note> getNotesByUserId(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return noteRepository.findByUserId(userId);
    }

    // Create a new note
    @Transactional
    public Note createNote(Note note) {
        if (note == null) {
            throw new IllegalArgumentException("Note cannot be null");
        }
        if (note.getId() != null) {
            throw new IllegalArgumentException("Cannot create a note with an existing ID");
        }
        return noteRepository.save(note);
    }

    // Update an existing note
    public Note updateNote(Long noteId, Note updatedNote) {
        Note existingNote = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        // Update fields
        existingNote.setTitle(updatedNote.getTitle());
        existingNote.setCategory(updatedNote.getCategory());
        existingNote.setDescription(updatedNote.getDescription());
        existingNote.setDate(updatedNote.getDate());

        return noteRepository.save(existingNote);
    }


    // Delete a note by its ID
    @Transactional
    public void deleteNoteById(Long noteId) {
        if (noteId == null) {
            throw new IllegalArgumentException("Note ID cannot be null");
        }
        if (!noteRepository.existsById(noteId)) {
            throw new IllegalArgumentException("Note with ID " + noteId + " does not exist");
        }
        noteRepository.deleteById(noteId);
    }

    // Get a single note by its ID
    public Optional<Note> getNoteById(Long noteId) {
        if (noteId == null) {
            throw new IllegalArgumentException("Note ID cannot be null");
        }
        return noteRepository.findById(noteId);
    }
}
