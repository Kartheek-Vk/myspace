package com.productivity.controller;

import com.productivity.dto.DashboardResponseDto;
import com.productivity.entity.User;
import com.productivity.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final TaskService taskService;

    public DashboardController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Extract the authenticated user from SecurityContext.
     */
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new SecurityException("User not authenticated");
        }
        return (User) authentication.getPrincipal();
    }

    @GetMapping("/task-summary")
    public ResponseEntity<DashboardResponseDto> getTaskSummary() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(taskService.getDashboardSummary(user.getId()));
    }
}
