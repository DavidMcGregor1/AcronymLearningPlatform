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
    @GetMapping(path = "/getAllQuestions", consumes = "application/json", produces = "application/json")
    public List<String> getAllQuestions(Model model) {
        List<Acronyms> allAcronyms = repositoryAcronyms.findAll();
        List<String> questions = new ArrayList<>();
        for (Acronyms a : allAcronyms) {
            if (a != null) {
                String fullQuestion = "What does " + a.getAcronym() + " stand for?";
                questions.add(fullQuestion);
                System.out.println(fullQuestion);
            }
        }
        return questions;
    }

    @GetMapping (path = "/quizPage")
    public String quizPage() {
        return "quizPage";
    }


}
