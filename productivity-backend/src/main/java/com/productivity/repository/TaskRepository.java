package com.productivity.repository;

import com.productivity.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {

    // =============================================
    // USER-SCOPED QUERIES (production use)
    // Enforce data isolation: only return tasks owned by the given user
    // =============================================

    List<Task> findByUserIdOrderByDueDateAscPriorityDesc(String userId);

    Optional<Task> findByIdAndUserId(String id, String userId);

    void deleteByIdAndUserId(String id, String userId);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND (t.startDate = :date OR t.dueDate = :date) ORDER BY t.priority DESC")
    List<Task> findTodayTasksByUserId(@Param("userId") String userId, @Param("date") LocalDate date);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.dueDate > :date AND t.status NOT IN ('COMPLETED', 'CANCELLED') ORDER BY t.dueDate ASC")
    List<Task> findUpcomingTasksByUserId(@Param("userId") String userId, @Param("date") LocalDate date);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.dueDate < :date AND t.status NOT IN ('COMPLETED', 'CANCELLED') ORDER BY t.dueDate ASC")
    List<Task> findOverdueTasksByUserId(@Param("userId") String userId, @Param("date") LocalDate date);

    List<Task> findByUserIdAndStatus(String userId, String status);

    List<Task> findByUserIdAndCategory(String userId, String category);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.status = :status")
    long countByUserIdAndStatus(@Param("userId") String userId, @Param("status") String status);

    @Query("SELECT COUNT(s) FROM Subtask s WHERE s.task.user.id = :userId AND s.completed = true")
    long countCompletedSubtasksByUserId(@Param("userId") String userId);

    @Query("SELECT COUNT(s) FROM Subtask s WHERE s.task.user.id = :userId")
    long countAllSubtasksByUserId(@Param("userId") String userId);

    @Query("SELECT COUNT(s) FROM Subtask s WHERE s.task.user.id = :userId AND s.task IN :tasks AND s.completed = true")
    long countCompletedSubtasksForTasksByUserId(@Param("userId") String userId, @Param("tasks") List<Task> tasks);

    @Query("SELECT COUNT(s) FROM Subtask s WHERE s.task.user.id = :userId AND s.task IN :tasks")
    long countAllSubtasksForTasksByUserId(@Param("userId") String userId, @Param("tasks") List<Task> tasks);
}
