package com.productivity.dto;

import com.productivity.entity.Subtask;
import java.time.format.DateTimeFormatter;

public class SubtaskResponseDto {
    private String id;
    private String taskId;
    private String title;
    private String description;
    private String status;
    private Boolean completed;
    private Integer orderIndex;
    private Integer estimatedMinutes;
    private String createdAt;
    private String updatedAt;
    private String completedAt;

    private static final DateTimeFormatter DATETIME_FMT = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public static SubtaskResponseDto from(Subtask subtask) {
        SubtaskResponseDto dto = new SubtaskResponseDto();
        dto.id = subtask.getId();
        dto.taskId = subtask.getTask() != null ? subtask.getTask().getId() : null;
        dto.title = subtask.getTitle();
        dto.description = subtask.getDescription();
        dto.status = subtask.getStatus();
        dto.completed = subtask.getCompleted();
        dto.orderIndex = subtask.getOrderIndex();
        dto.estimatedMinutes = subtask.getEstimatedMinutes();
        dto.createdAt = subtask.getCreatedAt() != null ? subtask.getCreatedAt().format(DATETIME_FMT) : null;
        dto.updatedAt = subtask.getUpdatedAt() != null ? subtask.getUpdatedAt().format(DATETIME_FMT) : null;
        dto.completedAt = subtask.getCompletedAt() != null ? subtask.getCompletedAt().format(DATETIME_FMT) : null;
        return dto;
    }

    public String getId() { return id; }
    public String getTaskId() { return taskId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public Boolean getCompleted() { return completed; }
    public Integer getOrderIndex() { return orderIndex; }
    public Integer getEstimatedMinutes() { return estimatedMinutes; }
    public String getCreatedAt() { return createdAt; }
    public String getUpdatedAt() { return updatedAt; }
    public String getCompletedAt() { return completedAt; }
}
