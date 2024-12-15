package edu.usc.noteapp.note_taking_system.repository;

import edu.usc.noteapp.note_taking_system.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Find category by name
    Optional<Category> findByName(String name);

    // Fetch all categories ordered by orderIndex in ascending order
    List<Category> findAllByOrderByOrderIndexAsc();

    // Find the maximum order index among all categories
    @Query("SELECT MAX(c.orderIndex) FROM Category c")
    Optional<Integer> findMaxOrderIndex();

    // Check if a name exists (optional for case-insensitive handling, if needed)
    @Query("SELECT COUNT(c) > 0 FROM Category c WHERE LOWER(c.name) = LOWER(?1)")
    boolean existsByNameIgnoreCase(String name);
}
