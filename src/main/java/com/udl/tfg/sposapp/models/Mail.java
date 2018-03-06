package com.udl.tfg.sposapp.models;

import org.hibernate.validator.constraints.Email;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import javax.validation.Payload;
import javax.validation.constraints.Pattern;
import java.lang.annotation.Annotation;
import java.util.Properties;


public class Mail  {

    public JavaMailSender email;

    public Mail () {

    }

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);

        mailSender.setUsername("didacflorensacazorla@gmail.com");
        mailSender.setPassword("didac.florensa");

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");

        return mailSender;
    }


    public void sendEmail (String to, String subject, String text) {
        this.email = getJavaMailSender();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        email.send(message);
    }



}
