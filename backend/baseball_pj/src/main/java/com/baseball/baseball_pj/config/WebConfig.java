package com.baseball.baseball_pj.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173") // 명시적으로 설정
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true); // 쿠키/인증정보 허용
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/{spring:[a-zA-Z0-9-]+}")
                .setViewName("forward:/index.html");
        registry.addViewController("/{spring:[a-zA-Z0-9-]+}/{spring2:[a-zA-Z0-9-]+}")
                .setViewName("forward:/index.html");
        registry.addViewController("/{spring:[a-zA-Z0-9-]+}/{spring2:[a-zA-Z0-9-]+}/{spring3:[a-zA-Z0-9-]+}")
                .setViewName("forward:/index.html");
    }


    
}