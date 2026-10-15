package com.careerhub.careerhub.config;

import com.careerhub.careerhub.user.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

                http
                                .csrf(csrf -> csrf.disable())

                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                .authorizeHttpRequests(auth -> auth

                                                .requestMatchers(
                                                                "/api/users",
                                                                "/api/users/login",
                                                                "/api/users/verify-email")
                                                .permitAll()

                                                .requestMatchers(
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/v3/api-docs/**")
                                                .permitAll()

                                                .requestMatchers("/api/users/student")
                                                .hasRole("STUDENT")

                                                .requestMatchers("/api/student-profile")
                                                .hasRole("STUDENT")

                                                .requestMatchers("/api/student-cv")
                                                .hasRole("STUDENT")

                                                .requestMatchers("/api/company")
                                                .hasRole("COMPANY")

                                                .requestMatchers(HttpMethod.GET, "/api/job-postings")
                                                .authenticated()

                                                .requestMatchers("/api/job-postings/**")
                                                .hasRole("COMPANY")

                                                .requestMatchers(HttpMethod.POST, "/api/job-applications")
                                                .hasRole("STUDENT")

                                                .requestMatchers(HttpMethod.GET, "/api/job-applications/student")
                                                .hasRole("STUDENT")

                                                .requestMatchers(HttpMethod.GET, "/api/job-applications/company")
                                                .hasRole("COMPANY")

                                                .requestMatchers(HttpMethod.PUT, "/api/job-applications/*/status")
                                                .hasRole("COMPANY")

                                                .requestMatchers(HttpMethod.GET, "/api/notifications")
                                                .authenticated()

                                                .requestMatchers(HttpMethod.PUT, "/api/notifications/*/read")
                                                .authenticated()

                                                .requestMatchers("/api/users/admin")
                                                .hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.GET, "/api/admin/users")
                                                .hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.GET, "/api/admin/companies")
                                                .hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.PUT, "/api/admin/companies/*/approval")
                                                .hasRole("ADMIN")

                                                .anyRequest()
                                                .authenticated())

                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}