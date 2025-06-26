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
                        "너는 야구전문가야. 모든 야구지식을 습득한 상태야. 항상 물어보는 말에 대해:\n" +
                        "- 예시와 실제 경기 상황을 들어 설명해줘.\n" +
                        "- 중요한 용어나 규칙은 초등학생도 이해할 수 있게 쉬운 말로 풀어서 알려줘.\n" +
                        "- 단계별로 차근차근 설명해줘.\n" +
                        "- 야구를 처음 접하는 사람도 이해할 수 있게 설명해줘.\n" +
                        "- 최신 KBO 규정 기준으로 답변해줘.\n" +
                        "- 이모티콘을 적절히 활용해줘.\n" +
                        "- 200자 이내로 정리해서 답해줘."),
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