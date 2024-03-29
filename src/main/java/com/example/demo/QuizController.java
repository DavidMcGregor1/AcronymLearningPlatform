package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

import java.util.*;
import java.util.stream.Collectors;

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
        Collections.shuffle(allAcronyms); // Shuffle the list of questions
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
                questionMap.put("answer", a.getMeaning());

                questions.add(questionMap);
            }
        }
        return questions;
    }

    @ResponseStatus(value = HttpStatus.OK)
    @ResponseBody
    @PostMapping(path = "/getSpecifiedNumberOfQuestions", produces = "application/json")
    public List<Map<String, Object>> getSpecifiedNumberOfQuestions(
            @RequestParam(name = "numberOfQuestions") int numberOfQuestions,
            @RequestParam(name = "category", defaultValue = "all") String category,
            @RequestParam(name = "length", defaultValue = "all") String length) {

        List<Acronyms> allAcronyms;

        if ("all".equals(category)) {
            allAcronyms = repositoryAcronyms.findAll();
        } else {
            allAcronyms = repositoryAcronyms.findByCategory(category);
        }

        // Filter by length
        if (length != null && !"all".equals(length)) {
            if (!"0".equals(length)) {
                int filterLength = Integer.parseInt(length);
                allAcronyms = allAcronyms.stream()
                        .filter(acronym -> acronym.getAcronym().length() == filterLength)
                        .collect(Collectors.toList());
            }
        }

        Collections.shuffle(allAcronyms); // Shuffle the list of questions
        List<Map<String, Object>> questions = new ArrayList<>();
        int count = 0;
        for (Acronyms a : allAcronyms) {
            if (a != null && count < numberOfQuestions) {
                List<String> options = new ArrayList<>();
                options.add(a.getMeaning()); // Add the real answer
                options.add(a.getFalseAnswer1());
                options.add(a.getFalseAnswer2());
                options.add(a.getFalseAnswer3());
                Collections.shuffle(options); // Shuffle the options
                Map<String, Object> questionMap = new HashMap<>();
                questionMap.put("question", "What does " + a.getAcronym() + " stand for?");
                questionMap.put("options", options);
                questionMap.put("answer", a.getMeaning());
                questions.add(questionMap);
                count++;
            }
        }
        return questions;
    }

    @GetMapping (path = "/quizPage")
    public String quizPage() {
        return "quizPage";
    }

    @GetMapping (path = "/quizMenuPage")
    public String quizMenuPage() {
        return "quizMenuPage";
    }

}
