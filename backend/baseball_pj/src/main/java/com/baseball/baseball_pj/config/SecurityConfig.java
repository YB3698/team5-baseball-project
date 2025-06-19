package com.baseball.baseball_pj.config;

// Spring Security 설정을 담당하는 클래스입니다.
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// 이 클래스가 설정 파일임을 명시합니다.
@Configuration
public class SecurityConfig {

    // 비밀번호 암호화를 위한 BCryptPasswordEncoder 빈을 등록합니다.
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    

    // Spring Security의 필터 체인을 설정합니다.
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF 보호 비활성화 (API 서버에서 주로 사용)
            .csrf(csrf -> csrf.disable())
            // CORS 기본 설정 적용
            .cors(Customizer.withDefaults())
            // 요청별 인가 정책 설정
            .authorizeHttpRequests(auth -> auth
                // 회원가입, 이메일/닉네임 중복확인, 로그인 API는 인증 없이 접근 허용
                .requestMatchers(
                    "/api/users/join",
                    "/api/users/check-email",
                    "/api/users/check-nickname",
                    "/api/users/login",
                    // ✅ 선수 목록 API 전체 인증 없이 허용
                    "/api/players",
                    "/api/players/**",
                    "/api/schedule",
                    "/api/schedule/**"
                ).permitAll()
                // 그 외 모든 요청은 거부
                .anyRequest().denyAll()
            )
            // 폼 로그인 비활성화 (자동 리다이렉트 방지, REST API 서버에 적합)
            .formLogin(login -> login.disable());

        // 설정이 적용된 SecurityFilterChain을 반환
        return http.build();
    }
}