package com.productivity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class TaskCreateDto {
    @NotBlank(message = "Task title is required")
    @Size(max = 200, message = "Title must be under 200 characters")
    private String title;

    @Size(max = 2000)
    private String description;

    private String category = "OTHER";
    private String subject;
    private String priority = "MEDIUM";
    private String status = "NOT_STARTED";
    private String startDate;
    private String dueDate;
    private String startTime;
    private String endTime;
    private Integer estimatedMinutes;
    private String notes;
    private List<String> tags;
    private List<SubtaskCreateDto> subtasks;

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
    public Integer getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public List<SubtaskCreateDto> getSubtasks() { return subtasks; }
    public void setSubtasks(List<SubtaskCreateDto> subtasks) { this.subtasks = subtasks; }
}
