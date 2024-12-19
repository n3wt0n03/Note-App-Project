package edu.usc.noteapp.note_taking_system.repository;

import edu.usc.noteapp.note_taking_system.model.Category;
import edu.usc.noteapp.note_taking_system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Find category by name and user
    Optional<Category> findByNameAndUser(String name, User user);

    // Fetch all categories ordered by orderIndex in ascending order for a specific user
    List<Category> findAllByUserOrderByOrderIndexAsc(User user);

    // Find the maximum order index among all categories for a specific user
    @Query("SELECT MAX(c.orderIndex) FROM Category c WHERE c.user = ?1")
    Optional<Integer> findMaxOrderIndexByUser(User user);

    // Check if a name exists (optional for case-insensitive handling, if needed) for a specific user
    @Query("SELECT COUNT(c) > 0 FROM Category c WHERE LOWER(c.name) = LOWER(?1) AND c.user = ?2")
    boolean existsByNameAndUserIgnoreCase(String name, User user);
}
