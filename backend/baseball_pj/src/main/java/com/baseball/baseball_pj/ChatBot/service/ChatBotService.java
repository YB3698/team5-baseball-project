package com.baseball.baseball_pj.ChatBot.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ChatBotService {

    @Value("${openai.api.key:}")
    private String apiKey;

    public String ask(String prompt) {
        // API 키가 없거나 비어있으면 오류 메시지 반환
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return "⚠️ OpenAI API 키가 설정되지 않았습니다. config/application-local.properties 파일을 확인해주세요.";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        List<Map<String, Object>> messages = List.of(
                Map.of("role", "system", "content",
                        "너는 야구전문가야. 친절하게 이모티콘 적절하게 쓰면서 야구를 잘 모르는 사람에게 초등학생이 알 수 있을 정도로 쉽게 야구 규칙이나 정보에 대해서 자세하게 알려줘. 200자 이내로 정리해서 답해줘. "),
                Map.of("role", "user", "content", prompt));

        Map<String, Object> body = Map.of(
                "model", "gpt-4.1-nano", // gpt 모델 선정
                "messages", messages, // 메시지 입력
                "temperature", 1, // 온도 설정 (0~2)
                "max_tokens", 200, // 최대 토큰 수 (1~4096)
                "presence_penalty", 0.6, // 새로운 주제에 대한 반응을 조절하는 패널티 (0~2)
                "frequency_penalty", 0.5 // 자주 등장하는 단어에 대한 패널티 (0~2)

        );
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://api.openai.com/v1/chat/completions",
                    HttpMethod.POST,
                    request,
                    Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            return "오류: " + e.getMessage();
        }
    }

}

//