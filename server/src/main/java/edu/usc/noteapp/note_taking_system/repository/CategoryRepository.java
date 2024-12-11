package edu.usc.noteapp.note_taking_system.repository;

import edu.usc.noteapp.note_taking_system.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
