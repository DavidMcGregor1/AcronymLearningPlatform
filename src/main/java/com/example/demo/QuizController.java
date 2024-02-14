package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.*;

@Controller
public class QuizController {
    public QuizController(AcronymsRepository a) {
        repositoryAcronyms = a;
    }

    private AcronymsRepository repositoryAcronyms;

    @ResponseStatus(value = HttpStatus.OK)
    @ResponseBody
    @GetMapping(path = "/getAllQuestions", produces = "application/json")
    public List<Map<String, Object>> getAllQuestions(Model model) {
        List<Acronyms> allAcronyms = repositoryAcronyms.findAll();
        List<Map<String, Object>> questions = new ArrayList<>();
        for (Acronyms a : allAcronyms) {
            if (a != null) {
                List<String> options = new ArrayList<>();
                options.add(a.getMeaning()); // Add the real answer
                options.add(a.getFalseAnswer1());
                options.add(a.getFalseAnswer2());
                options.add(a.getFalseAnswer3());
                Collections.shuffle(options); // Shuffle the options
                Map<String, Object> questionMap = new HashMap<>();
                questionMap.put("question", "What does " + a.getAcronym() + " stand for?");
                questionMap.put("options", options);

                questions.add(questionMap);
            }
        }
        return questions;
    }


    @GetMapping (path = "/quizPage")
    public String quizPage() {
        return "quizPage";
    }


}
