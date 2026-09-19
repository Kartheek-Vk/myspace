package com.productivity.controller;

import com.productivity.dto.*;
import com.productivity.entity.User;
import com.productivity.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Extract the authenticated user from SecurityContext.
     * Throws SecurityException if user is not authenticated.
     */
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new SecurityException("User not authenticated");
        }
        return (User) authentication.getPrincipal();
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDto>> getAllTasks() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(taskService.getAllTasks(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDto> getTaskById(@PathVariable String id) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(taskService.getTaskById(id, user.getId()));
    }

    @PostMapping
    public ResponseEntity<TaskResponseDto> createTask(@Valid @RequestBody TaskCreateDto dto) {
        User user = getAuthenticatedUser();
        TaskResponseDto created = taskService.createTask(dto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDto> updateTask(@PathVariable String id, @Valid @RequestBody TaskCreateDto dto) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(taskService.updateTask(id, dto, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        User user = getAuthenticatedUser();
        taskService.deleteTask(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/reschedule")
    public ResponseEntity<TaskResponseDto> rescheduleTask(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        User user = getAuthenticatedUser();
        String newDueDate = body.get("dueDate");
        if (newDueDate == null || newDueDate.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(taskService.rescheduleTask(id, newDueDate, user.getId()));
    }

    // Subtask endpoints
    @PostMapping("/{taskId}/subtasks")
    public ResponseEntity<SubtaskResponseDto> createSubtask(
            @PathVariable String taskId,
            @Valid @RequestBody SubtaskCreateDto dto) {
        User user = getAuthenticatedUser();
        SubtaskResponseDto created = taskService.createSubtask(taskId, dto, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{taskId}/subtasks/{subtaskId}")
    public ResponseEntity<SubtaskResponseDto> updateSubtask(
            @PathVariable String taskId,
            @PathVariable String subtaskId,
            @Valid @RequestBody SubtaskCreateDto dto) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(taskService.updateSubtask(taskId, subtaskId, dto, user.getId()));
    }

    @DeleteMapping("/{taskId}/subtasks/{subtaskId}")
    public ResponseEntity<Void> deleteSubtask(
            @PathVariable String taskId,
            @PathVariable String subtaskId) {
        User user = getAuthenticatedUser();
        taskService.deleteSubtask(taskId, subtaskId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{taskId}/subtasks/{subtaskId}/complete")
    public ResponseEntity<SubtaskResponseDto> toggleSubtaskCompletion(
            @PathVariable String taskId,
            @PathVariable String subtaskId) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(taskService.toggleSubtaskCompletion(taskId, subtaskId, user.getId()));
    }
}
