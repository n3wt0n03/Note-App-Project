package edu.usc.noteapp.note_taking_system.controller;

import edu.usc.noteapp.note_taking_system.model.Note;
import edu.usc.noteapp.note_taking_system.model.User;
import edu.usc.noteapp.note_taking_system.service.NoteService;
import edu.usc.noteapp.note_taking_system.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;
    private final UserRepository userRepository;

    public NoteController(NoteService noteService, UserRepository userRepository) {
        this.noteService = noteService;
        this.userRepository = userRepository;
    }

    // Fetch all notes for the authenticated user
    @GetMapping
    public ResponseEntity<List<Note>> getNotesByAuthenticatedUser() {
        String email = getAuthenticatedUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with email: " + email));

        List<Note> notes = noteService.getNotesByUserId(user.getId());
        return ResponseEntity.ok(notes);
    }

    // Fetch a specific note by ID
    @GetMapping("/{noteId}")
    public ResponseEntity<?> getNoteById(@PathVariable Long noteId) {
        String email = getAuthenticatedUserEmail();

        // Fetch the note
        Note note = noteService.getNoteById(noteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found"));

        // Ensure the authenticated user is the owner of the note
        if (!note.getUser().getEmail().equals(email)) {
            System.out.println("Ownership validation failed. Note owner: " + note.getUser().getEmail() + ", Authenticated user: " + email);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("{\"error\": \"You do not have permission to access this note.\"}");
        }

        return ResponseEntity.ok(note);
    }

    // Create a new note for the authenticated user
    @PostMapping
    public ResponseEntity<?> createNoteForAuthenticatedUser(@RequestBody Note note) {
        if (note.getId() != null) {
            return ResponseEntity.badRequest().body("Note ID should be null for creation");
        }

        String email = getAuthenticatedUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        note.setUser(user); // Associate the note with the user
        Note savedNote = noteService.createNote(note);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedNote);
    }

    // Update an existing note
    @PutMapping("/{noteId}")
    public ResponseEntity<?> updateNote(@PathVariable Long noteId, @RequestBody Note updatedNote) {
        String email = getAuthenticatedUserEmail();

        Note existingNote = noteService.getNoteById(noteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found"));

        // Ensure the authenticated user is the owner of the note
        if (!existingNote.getUser().getEmail().equals(email)) {
            System.out.println("Ownership validation failed. Note owner: " + existingNote.getUser().getEmail() + ", Authenticated user: " + email);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You do not have permission to update this note.");
        }

        // Update the note fields
        existingNote.setTitle(updatedNote.getTitle());
        existingNote.setDescription(updatedNote.getDescription());
        existingNote.setDate(updatedNote.getDate());
        existingNote.setColor(updatedNote.getColor());

        // Update the category if provided
        if (updatedNote.getCategory() != null) {
            existingNote.setCategory(updatedNote.getCategory());
        } else {
            existingNote.setCategory(null); // Allow clearing the category
        }

        // Save the updated note
        Note savedNote = noteService.updateNote(noteId, existingNote);

        return ResponseEntity.ok(savedNote);
    }

    // Delete a specific note by ID (secured by ownership)
    @DeleteMapping("/{noteId}")
    public ResponseEntity<?> deleteNoteById(@PathVariable Long noteId) {
        String email = getAuthenticatedUserEmail();

        Note note = noteService.getNoteById(noteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found"));

        // Ensure the authenticated user is the owner of the note
        if (!note.getUser().getEmail().equals(email)) {
            System.out.println("Ownership validation failed. Note owner: " + note.getUser().getEmail() + ", Authenticated user: " + email);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("{\"error\": \"You do not have permission to delete this note.\"}");
        }

        noteService.deleteNoteById(noteId);

        return ResponseEntity.ok("{\"message\": \"Note deleted successfully.\"}");
    }

    // Helper method to get the authenticated user's email
    private String getAuthenticatedUserEmail() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Authenticated user email: " + email);
        return email;
    }
}
