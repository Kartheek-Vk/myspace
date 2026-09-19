package com.productivity.repository;

import com.productivity.entity.Subtask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubtaskRepository extends JpaRepository<Subtask, String> {

    List<Subtask> findByTaskIdOrderByOrderIndexAsc(String taskId);

    Optional<Subtask> findByIdAndTaskId(String id, String taskId);

    long countByTaskIdAndCompletedTrue(String taskId);

    long countByTaskId(String taskId);

    @Query("SELECT MAX(s.orderIndex) FROM Subtask s WHERE s.task.id = :taskId")
    Integer findMaxOrderIndexByTaskId(@Param("taskId") String taskId);
}
