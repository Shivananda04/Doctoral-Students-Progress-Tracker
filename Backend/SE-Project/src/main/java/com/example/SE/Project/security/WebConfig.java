package com.example.SE.Project.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    
    @Override
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**") // allow all API endpoints
                .allowedOrigins("http://localhost:5173") // React frontend
                .allowedMethods("GET","POST", "PUT", "DELETE")
                .allowCredentials(true);
    }
}
