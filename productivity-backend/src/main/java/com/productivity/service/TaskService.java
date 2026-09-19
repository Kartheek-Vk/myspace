package com.productivity.service;

import com.productivity.dto.*;
import com.productivity.entity.Subtask;
import com.productivity.entity.Task;
import com.productivity.entity.User;
import com.productivity.repository.SubtaskRepository;
import com.productivity.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    private static final Set<String> VALID_CATEGORIES = Set.of("LIFE", "BTECH", "DSA", "JAVA_DAA", "PYTHON", "PROJECT", "CAREER", "OTHER");
    private static final Set<String> VALID_PRIORITIES = Set.of("LOW", "MEDIUM", "HIGH", "URGENT");
    private static final Set<String> VALID_STATUSES = Set.of("NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELLED");

    private final TaskRepository taskRepository;
    private final SubtaskRepository subtaskRepository;

    public TaskService(TaskRepository taskRepository, SubtaskRepository subtaskRepository) {
        this.taskRepository = taskRepository;
        this.subtaskRepository = subtaskRepository;
    }

    /**
     * Get all tasks for the authenticated user.
     * User isolation: Only returns tasks owned by the specified user.
     */
    public List<TaskResponseDto> getAllTasks(String userId) {
        return taskRepository.findByUserIdOrderByDueDateAscPriorityDesc(userId).stream()
                .map(TaskResponseDto::from)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific task by ID for the authenticated user.
     * User isolation: Prevents IDOR by requiring both taskId and userId.
     */
    public TaskResponseDto getTaskById(String id, String userId) {
        Task task = taskRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Task not found or access denied"));
        return TaskResponseDto.from(task);
    }

    /**
     * Create a new task for the authenticated user.
     * User ownership: Task is associated with the authenticated user.
     */
    public TaskResponseDto createTask(TaskCreateDto dto, User user) {
        validateTaskDto(dto);

        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setCategory(dto.getCategory());
        task.setSubject(dto.getSubject());
        task.setPriority(dto.getPriority());
        task.setStatus(dto.getStatus());
        task.setStartDate(dto.getStartDate() != null ? LocalDate.parse(dto.getStartDate()) : null);
        task.setDueDate(dto.getDueDate() != null ? LocalDate.parse(dto.getDueDate()) : null);
        task.setStartTime(dto.getStartTime() != null ? LocalTime.parse(dto.getStartTime()) : null);
        task.setEndTime(dto.getEndTime() != null ? LocalTime.parse(dto.getEndTime()) : null);
        task.setEstimatedMinutes(dto.getEstimatedMinutes());
        task.setNotes(dto.getNotes());
        task.setTags(dto.getTags() != null ? String.join(",", dto.getTags()) : null);
        task.setUser(user); // Associate with authenticated user

        Task savedTask = taskRepository.save(task);

        // Create subtasks
        if (dto.getSubtasks() != null) {
            for (int i = 0; i < dto.getSubtasks().size(); i++) {
                SubtaskCreateDto stDto = dto.getSubtasks().get(i);
                Subtask subtask = new Subtask();
                subtask.setTitle(stDto.getTitle());
                subtask.setDescription(stDto.getDescription());
                subtask.setStatus("NOT_STARTED");
                subtask.setCompleted(false);
                subtask.setOrderIndex(stDto.getOrderIndex() != null ? stDto.getOrderIndex() : i);
                subtask.setEstimatedMinutes(stDto.getEstimatedMinutes());
                savedTask.addSubtask(subtask);
            }
            savedTask = taskRepository.save(savedTask);
        }

        // Recalculate status
        recalculateTaskStatus(savedTask);
        savedTask = taskRepository.save(savedTask);

        return TaskResponseDto.from(savedTask);
    }

    /**
     * Update a task for the authenticated user.
     * User isolation: Prevents IDOR by requiring both taskId and userId.
     */
    public TaskResponseDto updateTask(String id, TaskCreateDto dto, String userId) {
        Task task = taskRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Task not found or access denied"));

        validateTaskDto(dto);

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setCategory(dto.getCategory());
        task.setSubject(dto.getSubject());
        task.setPriority(dto.getPriority());
        if (dto.getStatus() != null && VALID_STATUSES.contains(dto.getStatus())) {
            task.setStatus(dto.getStatus());
        }
        task.setStartDate(dto.getStartDate() != null ? LocalDate.parse(dto.getStartDate()) : null);
        task.setDueDate(dto.getDueDate() != null ? LocalDate.parse(dto.getDueDate()) : null);
        task.setStartTime(dto.getStartTime() != null ? LocalTime.parse(dto.getStartTime()) : null);
        task.setEndTime(dto.getEndTime() != null ? LocalTime.parse(dto.getEndTime()) : null);
        task.setEstimatedMinutes(dto.getEstimatedMinutes());
        task.setNotes(dto.getNotes());
        task.setTags(dto.getTags() != null ? String.join(",", dto.getTags()) : null);

        recalculateTaskStatus(task);
        task = taskRepository.save(task);

        return TaskResponseDto.from(task);
    }

    /**
     * Delete a task for the authenticated user.
     * User isolation: Prevents IDOR by requiring both taskId and userId.
     */
    public void deleteTask(String id, String userId) {
        Task task = taskRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Task not found or access denied"));
        taskRepository.delete(task);
    }

    /**
     * Reschedule a task for the authenticated user.
     * User isolation: Prevents IDOR by requiring both taskId and userId.
     */
    public TaskResponseDto rescheduleTask(String id, String newDueDate, String userId) {
        Task task = taskRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Task not found or access denied"));
        task.setDueDate(LocalDate.parse(newDueDate));
        task = taskRepository.save(task);
        return TaskResponseDto.from(task);
    }

    // Subtask operations with user isolation

    /**
     * Create a subtask for a task owned by the authenticated user.
     * User isolation: Verifies task ownership before creating subtask.
     */
    public SubtaskResponseDto createSubtask(String taskId, SubtaskCreateDto dto, String userId) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found or access denied"));

        Subtask subtask = new Subtask();
        subtask.setTitle(dto.getTitle());
        subtask.setDescription(dto.getDescription());
        subtask.setStatus("NOT_STARTED");
        subtask.setCompleted(false);
        subtask.setEstimatedMinutes(dto.getEstimatedMinutes());

        Integer maxOrder = subtaskRepository.findMaxOrderIndexByTaskId(taskId);
        subtask.setOrderIndex(dto.getOrderIndex() != null ? dto.getOrderIndex() : (maxOrder != null ? maxOrder + 1 : 0));

        task.addSubtask(subtask);
        recalculateTaskStatus(task);
        taskRepository.save(task);

        return SubtaskResponseDto.from(subtask);
    }

    /**
     * Update a subtask for a task owned by the authenticated user.
     * User isolation: Verifies task ownership before updating subtask.
     */
    public SubtaskResponseDto updateSubtask(String taskId, String subtaskId, SubtaskCreateDto dto, String userId) {
        // Verify task ownership
        taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found or access denied"));

        Subtask subtask = subtaskRepository.findByIdAndTaskId(subtaskId, taskId)
                .orElseThrow(() -> new RuntimeException("Subtask not found or doesn't belong to this task"));

        subtask.setTitle(dto.getTitle());
        if (dto.getDescription() != null) subtask.setDescription(dto.getDescription());
        if (dto.getOrderIndex() != null) subtask.setOrderIndex(dto.getOrderIndex());
        if (dto.getEstimatedMinutes() != null) subtask.setEstimatedMinutes(dto.getEstimatedMinutes());

        subtask = subtaskRepository.save(subtask);
        return SubtaskResponseDto.from(subtask);
    }

    /**
     * Delete a subtask for a task owned by the authenticated user.
     * User isolation: Verifies task ownership before deleting subtask.
     */
    public void deleteSubtask(String taskId, String subtaskId, String userId) {
        // Verify task ownership
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found or access denied"));

        Subtask subtask = subtaskRepository.findByIdAndTaskId(subtaskId, taskId)
                .orElseThrow(() -> new RuntimeException("Subtask not found or doesn't belong to this task"));

        task.removeSubtask(subtask);
        recalculateTaskStatus(task);
        taskRepository.save(task);
    }

    /**
     * Toggle subtask completion for a task owned by the authenticated user.
     * User isolation: Verifies task ownership before toggling subtask.
     * 
     * IMPORTANT: This does NOT auto-complete the parent task.
     * User must explicitly complete tasks - focus timer completion does not auto-complete subtasks.
     */
    public SubtaskResponseDto toggleSubtaskCompletion(String taskId, String subtaskId, String userId) {
        // Verify task ownership
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Task not found or access denied"));

        Subtask subtask = subtaskRepository.findByIdAndTaskId(subtaskId, taskId)
                .orElseThrow(() -> new RuntimeException("Subtask not found or doesn't belong to this task"));

        subtask.setCompleted(!subtask.getCompleted());
        subtask.setStatus(subtask.getCompleted() ? "COMPLETED" : "NOT_STARTED");
        subtask.setCompletedAt(subtask.getCompleted() ? LocalDateTime.now() : null);

        subtask = subtaskRepository.save(subtask);

        // Recalculate parent task progress (but don't auto-complete)
        recalculateTaskStatus(task);
        taskRepository.save(task);

        return SubtaskResponseDto.from(subtask);
    }

    // Dashboard with user isolation

    /**
     * Get dashboard summary for the authenticated user.
     * User isolation: Only includes tasks owned by the specified user.
     */
    public DashboardResponseDto getDashboardSummary(String userId) {
        LocalDate today = LocalDate.now();
        List<Task> allTasks = taskRepository.findByUserIdOrderByDueDateAscPriorityDesc(userId);
        List<Task> todayTasks = taskRepository.findTodayTasksByUserId(userId, today);

        DashboardResponseDto.SummaryDto todaySummary = buildSummary(todayTasks);
        DashboardResponseDto.SummaryDto overallSummary = buildSummary(allTasks);

        List<DashboardResponseDto.TodayTaskDto> todayTaskDtos = todayTasks.stream()
                .map(task -> {
                    DashboardResponseDto.TodayTaskDto dto = new DashboardResponseDto.TodayTaskDto();
                    dto.setId(task.getId());
                    dto.setTitle(task.getTitle());
                    dto.setCategory(task.getCategory());
                    dto.setPriority(task.getPriority());
                    dto.setStatus(task.getStatus());
                    int total = task.getSubtasks().size();
                    int completed = (int) task.getSubtasks().stream().filter(Subtask::getCompleted).count();
                    dto.setTotalSubtasks(total);
                    dto.setCompletedSubtasks(completed);
                    dto.setProgressPercentage(total > 0 ? (int) Math.round((double) completed / total * 100) : (task.getStatus().equals("COMPLETED") ? 100 : 0));
                    return dto;
                })
                .collect(Collectors.toList());

        return new DashboardResponseDto(todaySummary, overallSummary, todayTaskDtos);
    }

    private DashboardResponseDto.SummaryDto buildSummary(List<Task> tasks) {
        DashboardResponseDto.SummaryDto summary = new DashboardResponseDto.SummaryDto();
        summary.setTotalTasks(tasks.size());
        summary.setCompletedTasks((int) tasks.stream().filter(t -> t.getStatus().equals("COMPLETED")).count());
        summary.setInProgressTasks((int) tasks.stream().filter(t -> t.getStatus().equals("IN_PROGRESS")).count());
        summary.setNotStartedTasks((int) tasks.stream().filter(t -> t.getStatus().equals("NOT_STARTED")).count());
        summary.setCancelledTasks((int) tasks.stream().filter(t -> t.getStatus().equals("CANCELLED")).count());

        int totalSubtasks = tasks.stream().mapToInt(t -> t.getSubtasks().size()).sum();
        int completedSubtasks = tasks.stream()
                .flatMap(t -> t.getSubtasks().stream())
                .filter(Subtask::getCompleted)
                .collect(Collectors.toList()).size();

        summary.setTotalSubtasks(totalSubtasks);
        summary.setCompletedSubtasks(completedSubtasks);
        summary.setProgressPercentage(totalSubtasks > 0
                ? (int) Math.round((double) completedSubtasks / totalSubtasks * 100)
                : (tasks.size() > 0
                    ? (int) Math.round((double) summary.getCompletedTasks() / tasks.size() * 100)
                    : 0));

        return summary;
    }

    // Business logic helpers

    /**
     * Recalculate task status based on subtask progress.
     * 
     * IMPORTANT: This calculates progress but does NOT auto-complete tasks.
     * User must explicitly complete tasks - focus timer completion does not auto-complete subtasks.
     * 
     * Logic:
     * - If task is CANCELLED, keep as cancelled
     * - If no subtasks, keep current status (unless it was auto-set)
     * - If 0 subtasks completed: NOT_STARTED
     * - If all subtasks completed: COMPLETED (but only if user explicitly set it)
     * - If some subtasks completed: IN_PROGRESS
     */
    private void recalculateTaskStatus(Task task) {
        if (task.getStatus().equals("CANCELLED")) return;

        List<Subtask> subtasks = task.getSubtasks();
        if (subtasks.isEmpty()) {
            // No subtasks: keep current status unless it was auto-set
            if (task.getStatus().equals("COMPLETED")) {
                // Keep as completed (manual set)
            } else {
                task.setStatus("NOT_STARTED");
            }
            return;
        }

        long completed = subtasks.stream().filter(Subtask::getCompleted).count();
        int total = subtasks.size();

        if (completed == 0) {
            task.setStatus("NOT_STARTED");
            task.setCompletedAt(null);
        } else if (completed == total) {
            task.setStatus("COMPLETED");
            task.setCompletedAt(LocalDateTime.now());
        } else {
            task.setStatus("IN_PROGRESS");
            task.setCompletedAt(null);
        }
    }

    private void validateTaskDto(TaskCreateDto dto) {
        if (dto.getCategory() != null && !VALID_CATEGORIES.contains(dto.getCategory())) {
            throw new RuntimeException("Invalid category: " + dto.getCategory());
        }
        if (dto.getPriority() != null && !VALID_PRIORITIES.contains(dto.getPriority())) {
            throw new RuntimeException("Invalid priority: " + dto.getPriority());
        }
        if (dto.getStatus() != null && !VALID_STATUSES.contains(dto.getStatus())) {
            throw new RuntimeException("Invalid status: " + dto.getStatus());
        }
        if (dto.getStartDate() != null && dto.getDueDate() != null) {
            LocalDate start = LocalDate.parse(dto.getStartDate());
            LocalDate due = LocalDate.parse(dto.getDueDate());
            if (due.isBefore(start)) {
                throw new RuntimeException("Due date cannot be before start date");
            }
        }
    }
}
