package com.productivity.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Email service for sending notifications.
 *
 * In production, integrate with an SMTP provider (SendGrid, AWS SES, etc.)
 * using environment variables for credentials.
 *
 * Never hardcode credentials.
 * Never trust frontend-supplied email addresses.
 * Always use the authenticated user's Google email.
 */
@Service
public class EmailService {

    @Value("${mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${mail.host:}")
    private String mailHost;

    @Value("${mail.port:587}")
    private int mailPort;

    @Value("${mail.username:}")
    private String mailUsername;

    @Value("${mail.from:noreply@myspace.app}")
    private String mailFrom;

    /**
     * Send daily plan completion email.
     * Only called when 100% of Finish Line tasks are completed.
     *
     * @param userEmail The authenticated Google account email
     * @param userName  The user's display name
     * @param completedTasks Number of completed tasks
     * @param totalTasks Total required tasks
     * @param completedSubtasks Number of completed subtasks
     * @param totalSubtasks Total subtasks
     * @param rewardType The user's configured reward
     */
    public void sendDailyCompletionEmail(
            String userEmail,
            String userName,
            int completedTasks,
            int totalTasks,
            int completedSubtasks,
            int totalSubtasks,
            String rewardType
    ) {
        if (!mailEnabled || userEmail == null) {
            logEmail("DailyCompletion", userEmail, userName, completedTasks, totalTasks);
            return;
        }

        String subject = "🎉 You finished today's plan!";
        String body = String.format(
            "Hi %s,\n\n" +
            "You completed everything you planned for today.\n\n" +
            "Today's progress:\n" +
            "100%%\n\n" +
            "Tasks: %d / %d completed\n" +
            "Subtasks: %d / %d completed\n\n" +
            "You planned it. You did it.\n\n" +
            "%s unlocked.\n\n" +
            "Take it easy 😌\n\n" +
            "— MySpace",
            userName, completedTasks, totalTasks, completedSubtasks, totalSubtasks, rewardType
        );

        sendEmail(userEmail, subject, body);
    }

    /**
     * Send tomorrow's plan reminder email.
     *
     * @param userEmail The authenticated Google account email
     * @param userName  The user's display name
     * @param classesCount Number of classes/commitments
     * @param freeTimeMinutes Available free time in minutes
     * @param plannedMinutes Planned work in minutes
     * @param fits Whether the plan fits
     */
    public void sendTomorrowReminderEmail(
            String userEmail,
            String userName,
            int classesCount,
            int freeTimeMinutes,
            int plannedMinutes,
            boolean fits
    ) {
        if (!mailEnabled || userEmail == null) {
            logEmail("TomorrowReminder", userEmail, userName, classesCount, freeTimeMinutes);
            return;
        }

        String fitStatus = fits ? "✓ Your plan fits." : "⚠ Your planned work is longer than your available time.";
        String freeTimeStr = formatMinutes(freeTimeMinutes);
        String plannedStr = formatMinutes(plannedMinutes);

        String subject = "🌅 Tomorrow's plan";
        String body = String.format(
            "Hi %s,\n\n" +
            "Here's what tomorrow looks like.\n\n" +
            "Classes/Commitments: %d\n" +
            "Free time: %s\n" +
            "Planned work: %s\n\n" +
            "%s\n\n" +
            "Take it easy tonight.\n" +
            "Tomorrow is ready.\n\n" +
            "— MySpace",
            userName, classesCount, freeTimeStr, plannedStr, fitStatus
        );

        sendEmail(userEmail, subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        // In production, implement actual SMTP sending here
        // Using JavaMailSender or a third-party API (SendGrid, AWS SES, etc.)
        //
        // Example with JavaMailSender:
        // SimpleMailMessage message = new SimpleMailMessage();
        // message.setFrom(mailFrom);
        // message.setTo(to);
        // message.setSubject(subject);
        // message.setText(body);
        // mailSender.send(message);

        System.out.println("[EmailService] Sending email:");
        System.out.println("  To: " + to);
        System.out.println("  Subject: " + subject);
        System.out.println("  Body: " + body.substring(0, Math.min(100, body.length())) + "...");
    }

    private void logEmail(String type, String to, String name, int val1, int val2) {
        System.out.println(String.format(
            "[EmailService] %s email (mail disabled): to=%s, name=%s, values=%d/%d at %s",
            type, to, name, val1, val2,
            LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        ));
    }

    private String formatMinutes(int minutes) {
        int hours = minutes / 60;
        int mins = minutes % 60;
        if (hours == 0) return mins + "m";
        if (mins == 0) return hours + "h";
        return hours + "h " + mins + "m";
    }
}
