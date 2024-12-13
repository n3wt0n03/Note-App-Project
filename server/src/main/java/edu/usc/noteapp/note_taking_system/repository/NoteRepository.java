package edu.usc.noteapp.note_taking_system.repository;

import edu.usc.noteapp.note_taking_system.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    // Find notes by user ID
    List<Note> findByUserId(Long userId);

    // Count notes by category ID
    @Query("SELECT COUNT(n) FROM Note n WHERE n.category.id = :categoryId")
    int countByCategoryId(@Param("categoryId") Long categoryId);

    // Find all notes by category ID
    @Query("SELECT n FROM Note n WHERE n.category.id = :categoryId")
    List<Note> findByCategoryId(@Param("categoryId") Long categoryId);
}
