package com.test.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String token) {
        String subject = "Your Online Document Hub Verification Code";
        
        String message = "Welcome to Online Document Hub!\n\n" +
                "Your verification code is: " + token + "\n\n" +
                "Please enter this code on the verification page to activate your account.\n\n" +
                "If you did not register for this account, please ignore this email.";

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(to);
        email.setSubject(subject);
        email.setText(message);
        email.setFrom("vazelodie096@gmail.com");

        try {
            mailSender.send(email);
            log.info("Verification email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send verification email to {}", to, e);
            // Removing exception throw so SMTP errors do not block flow
        }
    }

    public void sendAccountEnabledEmail(String to) {
        String subject = "Account Access Granted - Online Document Hub";
        String message = "Hello,\n\nGood news! Your account access has been granted by an administrator.\n" +
                "You can now log in to the Online Document Hub and access your documents.\n\n" +
                "Best regards,\nThe Admin Team";
        sendEmailSafely(to, subject, message, "Account Enabled");
    }

    public void sendAccountDisabledEmail(String to) {
        String subject = "Account Access Revoked - Online Document Hub";
        String message = "Hello,\n\nNotice: Your account access has been revoked by an administrator.\n" +
                "You will temporarily be unable to log in to the platform. Please contact support for more information.\n\n" +
                "Best regards,\nThe Admin Team";
        sendEmailSafely(to, subject, message, "Account Disabled");
    }

    public void sendAccountDeletedEmail(String to) {
        String subject = "Account Deleted - Online Document Hub";
        String message = "Hello,\n\nWe are writing to inform you that your account on Online Document Hub has been permanently deleted by an administrator.\n" +
                "If you believe this was an error, please contact our support team immediately.\n\n" +
                "Best regards,\nThe Admin Team";
        sendEmailSafely(to, subject, message, "Account Deleted");
    }

    private void sendEmailSafely(String to, String subject, String text, String type) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(to);
        email.setSubject(subject);
        email.setText(text);
        email.setFrom("vazelodie096@gmail.com");

        try {
            mailSender.send(email);
            log.info("{} email sent to {}", type, to);
        } catch (Exception e) {
            log.error("Failed to send {} email to {}", type, to, e);
        }
    }
}
