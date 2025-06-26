package com.baseball.baseball_pj.ChatBot.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.baseball.baseball_pj.ChatBot.DTO.ChatBotDTO;
import com.baseball.baseball_pj.ChatBot.service.ChatBotService;

@RestController
public class ChatBotController {
    private final ChatBotService chatBotService;

    public ChatBotController(ChatBotService chatBotService) {
        this.chatBotService = chatBotService;
    }

    @PostMapping("/api/chatbot")
    public Map<String, String> chat(@RequestBody ChatBotDTO request) {
        System.out.println(request.getMessage());
        String message = request.getMessage();
        String answer;

        if ("안녕".equals(message)) {
            answer = "반가워😉";
        } else if ("배고파".equals(message)) {
            answer = "밥 먹ㅇㅓ🍚";
        } else {
            // openai()
            answer = chatBotService.ask(message);
        }

        return Map.of("reply", answer);
    }
}

