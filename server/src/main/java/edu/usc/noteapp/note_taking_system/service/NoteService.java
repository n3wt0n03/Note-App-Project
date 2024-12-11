package edu.usc.noteapp.note_taking_system.service;

import edu.usc.noteapp.note_taking_system.model.Note;
import edu.usc.noteapp.note_taking_system.repository.NoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
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
        return noteRepository.save(note);
    }

    // Update an existing note
    public Note updateNote(Long noteId, Note updatedNote) {
        return noteRepository.findById(noteId).map(existingNote -> {
            existingNote.setTitle(updatedNote.getTitle());
            existingNote.setCategory(updatedNote.getCategory());
            existingNote.setDescription(updatedNote.getDescription());
            existingNote.setDate(updatedNote.getDate());
            existingNote.setColor(updatedNote.getColor()); // Update color property
            return noteRepository.save(existingNote);
        }).orElseThrow(() -> new RuntimeException("Note not found with ID: " + noteId));
    }

    // Delete a note by ID
    public void deleteNoteById(Long noteId) {
        noteRepository.deleteById(noteId);
    }
}
