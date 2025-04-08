package com.example.SE.Project.security;

import java.io.IOException;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.SE.Project.Model.Coordinator;
import com.example.SE.Project.Model.Student;
import com.example.SE.Project.Model.Supervisor;
import com.example.SE.Project.Model.UserRole;
import com.example.SE.Project.Repository.CoordinatorRepository;
import com.example.SE.Project.Repository.StudentRepository;
import com.example.SE.Project.Repository.SupervisorRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class SecurityConfig {

    private final StudentRepository studentRepository;
    private final SupervisorRepository supervisorRepository;
    private final CoordinatorRepository coordinatorRepository;

    public SecurityConfig(StudentRepository studentRepository,
                        SupervisorRepository supervisorRepository,
                        CoordinatorRepository coordinatorRepository) {
        this.studentRepository = studentRepository;
        this.supervisorRepository = supervisorRepository;
        this.coordinatorRepository = coordinatorRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(
                    "/", 
                    "/login**", 
                    "/error",         
                    "/error/**",      
                    "/api/auth/**", 
                    "/oauth2/**",
                    "/students/upload",
                    "/api/dc-meetings/**",
                    "/api/meetings/**",
                    "/api/meetings/meeting/**",
                    "/api/swayam-courses/**",
                    "/api/courses/**",
                    "/api/publications/**",
                    "/api/publicationss/**",
                    "/api/supervisor/**",
                    "/coordinator/**",
                    "/supervisor/**",
                    "/student/**"
                ).permitAll()
                
                // Role-based endpoints
                .requestMatchers("/api/supervisor/**").hasRole("SUPERVISOR")
                .requestMatchers("/api/publications").hasRole("STUDENT")
                .requestMatchers("/api/publicationss").hasRole("SUPERVISOR")
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2LoginSuccessHandler())
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/")
                .permitAll()
            )
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) -> {
                    response.sendRedirect("/login");
                })
            )
            .build();
    }

    @Bean
    public AuthenticationSuccessHandler oAuth2LoginSuccessHandler() {
        return (request, response, authentication) -> {
            try {
                String userEmail = ((OAuth2AuthenticationToken) authentication)
                    .getPrincipal()
                    .getAttributes()
                    .get("email")
                    .toString();
                String requestedRoleStr = getCookieValue(request, "requestedRole");
                
                if (requestedRoleStr == null || requestedRoleStr.isEmpty()) {
                    response.sendRedirect("http://localhost:5173/login?error=role_missing");
                    return;
                }

                UserRole requestedRole;
                try {
                    requestedRole = UserRole.valueOf(requestedRoleStr.toUpperCase());
                } catch (IllegalArgumentException e) {
                    response.sendRedirect("http://localhost:5173/login?error=invalid_requested_role");
                    return;
                }

                UserRole actualRole = getActualRole(userEmail, requestedRole);

                if (actualRole == null || !actualRole.equals(requestedRole)) {
                    response.sendRedirect("http://localhost:5173/login?error=role_mismatch");
                    return;
                }

                String redirectUrl = switch (actualRole) {
                    case STUDENT -> "http://localhost:5173/student/dashboard";
                    case SUPERVISOR -> "http://localhost:5173/supervisor/dashboard";
                    case COORDINATOR -> "http://localhost:5173/coordinator/dashboard";
                    default -> "http://localhost:5173/login?error=invalid_role";
                };

                response.sendRedirect(redirectUrl);
            } catch (IOException e) {
                response.sendRedirect("http://localhost:5173/login?error=server_error");
            }
        };
    }

    private UserRole getActualRole(String userEmail, UserRole requestedRole) {
        return switch (requestedRole) {
            case STUDENT -> studentRepository.findByEmail(userEmail)
                .map(Student::getUserRole)
                .orElse(null);
            case SUPERVISOR -> supervisorRepository.findByEmail(userEmail)
                .map(Supervisor::getUserRole)
                .orElse(null);
            case COORDINATOR -> coordinatorRepository.findByEmail(userEmail)
                .map(Coordinator::getUserRole)
                .orElse(null);
            default -> null;
        };
    }

    private String getCookieValue(HttpServletRequest request, String name) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (name.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public HttpFirewall relaxedFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowUrlEncodedPercent(true);
        firewall.setAllowUrlEncodedSlash(true);
        firewall.setAllowSemicolon(true);
        firewall.setAllowBackSlash(true);
        firewall.setAllowUrlEncodedPeriod(true);
        return firewall;
    }
}