package com.productivity.dto;

import com.productivity.entity.Task;
import com.productivity.entity.Subtask;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;

public class TaskResponseDto {
    private String id;
    private String title;
    private String description;
    private String category;
    private String subject;
    private String priority;
    private String status;
    private String startDate;
    private String dueDate;
    private String startTime;
    private String endTime;
    private Integer estimatedMinutes;
    private String notes;
    private List<String> tags;
    private String createdAt;
    private String updatedAt;
    private String completedAt;
    private List<SubtaskResponseDto> subtasks;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ISO_LOCAL_TIME;
    private static final DateTimeFormatter DATETIME_FMT = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public static TaskResponseDto from(Task task) {
        TaskResponseDto dto = new TaskResponseDto();
        dto.id = task.getId();
        dto.title = task.getTitle();
        dto.description = task.getDescription();
        dto.category = task.getCategory();
        dto.subject = task.getSubject();
        dto.priority = task.getPriority();
        dto.status = task.getStatus();
        dto.startDate = task.getStartDate() != null ? task.getStartDate().format(DATE_FMT) : null;
        dto.dueDate = task.getDueDate() != null ? task.getDueDate().format(DATE_FMT) : null;
        dto.startTime = task.getStartTime() != null ? task.getStartTime().format(TIME_FMT) : null;
        dto.endTime = task.getEndTime() != null ? task.getEndTime().format(TIME_FMT) : null;
        dto.estimatedMinutes = task.getEstimatedMinutes();
        dto.notes = task.getNotes();
        dto.tags = task.getTags() != null && !task.getTags().isEmpty()
                ? Arrays.asList(task.getTags().split(","))
                : List.of();
        dto.createdAt = task.getCreatedAt() != null ? task.getCreatedAt().format(DATETIME_FMT) : null;
        dto.updatedAt = task.getUpdatedAt() != null ? task.getUpdatedAt().format(DATETIME_FMT) : null;
        dto.completedAt = task.getCompletedAt() != null ? task.getCompletedAt().format(DATETIME_FMT) : null;
        dto.subtasks = task.getSubtasks() != null
                ? task.getSubtasks().stream().map(SubtaskResponseDto::from).collect(Collectors.toList())
                : List.of();
        return dto;
    }

    // Getters
    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getSubject() { return subject; }
    public String getPriority() { return priority; }
    public String getStatus() { return status; }
    public String getStartDate() { return startDate; }
    public String getDueDate() { return dueDate; }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
    public Integer getEstimatedMinutes() { return estimatedMinutes; }
    public String getNotes() { return notes; }
    public List<String> getTags() { return tags; }
    public String getCreatedAt() { return createdAt; }
    public String getUpdatedAt() { return updatedAt; }
    public String getCompletedAt() { return completedAt; }
    public List<SubtaskResponseDto> getSubtasks() { return subtasks; }
}
