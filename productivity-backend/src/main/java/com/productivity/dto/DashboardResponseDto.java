package com.productivity.dto;

import java.util.List;

public class DashboardResponseDto {
    private SummaryDto today;
    private SummaryDto overall;
    private List<TodayTaskDto> todayTasks;

    public DashboardResponseDto() {}

    public DashboardResponseDto(SummaryDto today, SummaryDto overall, List<TodayTaskDto> todayTasks) {
        this.today = today;
        this.overall = overall;
        this.todayTasks = todayTasks;
    }

    public SummaryDto getToday() { return today; }
    public void setToday(SummaryDto today) { this.today = today; }
    public SummaryDto getOverall() { return overall; }
    public void setOverall(SummaryDto overall) { this.overall = overall; }
    public List<TodayTaskDto> getTodayTasks() { return todayTasks; }
    public void setTodayTasks(List<TodayTaskDto> todayTasks) { this.todayTasks = todayTasks; }

    public static class SummaryDto {
        private int totalTasks;
        private int completedTasks;
        private int inProgressTasks;
        private int notStartedTasks;
        private int cancelledTasks;
        private int totalSubtasks;
        private int completedSubtasks;
        private int progressPercentage;

        public SummaryDto() {}

        public int getTotalTasks() { return totalTasks; }
        public void setTotalTasks(int totalTasks) { this.totalTasks = totalTasks; }
        public int getCompletedTasks() { return completedTasks; }
        public void setCompletedTasks(int completedTasks) { this.completedTasks = completedTasks; }
        public int getInProgressTasks() { return inProgressTasks; }
        public void setInProgressTasks(int inProgressTasks) { this.inProgressTasks = inProgressTasks; }
        public int getNotStartedTasks() { return notStartedTasks; }
        public void setNotStartedTasks(int notStartedTasks) { this.notStartedTasks = notStartedTasks; }
        public int getCancelledTasks() { return cancelledTasks; }
        public void setCancelledTasks(int cancelledTasks) { this.cancelledTasks = cancelledTasks; }
        public int getTotalSubtasks() { return totalSubtasks; }
        public void setTotalSubtasks(int totalSubtasks) { this.totalSubtasks = totalSubtasks; }
        public int getCompletedSubtasks() { return completedSubtasks; }
        public void setCompletedSubtasks(int completedSubtasks) { this.completedSubtasks = completedSubtasks; }
        public int getProgressPercentage() { return progressPercentage; }
        public void setProgressPercentage(int progressPercentage) { this.progressPercentage = progressPercentage; }
    }

    public static class TodayTaskDto {
        private String id;
        private String title;
        private String category;
        private String priority;
        private String status;
        private int totalSubtasks;
        private int completedSubtasks;
        private int progressPercentage;

        public TodayTaskDto() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public int getTotalSubtasks() { return totalSubtasks; }
        public void setTotalSubtasks(int totalSubtasks) { this.totalSubtasks = totalSubtasks; }
        public int getCompletedSubtasks() { return completedSubtasks; }
        public void setCompletedSubtasks(int completedSubtasks) { this.completedSubtasks = completedSubtasks; }
        public int getProgressPercentage() { return progressPercentage; }
        public void setProgressPercentage(int progressPercentage) { this.progressPercentage = progressPercentage; }
    }
}
