package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

@Controller
public class QuizController {
    public QuizController(AcronymsRepository a) {
        repositoryAcronyms = a;
    }

    private AcronymsRepository repositoryAcronyms;

    @ResponseStatus(value = HttpStatus.OK)
    @ResponseBody
    @GetMapping(path = "/getQuestion", consumes = "application/json", produces = "application/json")
    public String getQuestion(Model model) {
        List<Acronyms> allAcronyms = repositoryAcronyms.findAll();

        Set<Integer> askedIndices = new HashSet<>();

        Random random = new Random();
        int numberOfAcronyms = allAcronyms.size();

        int randomAcronymIndex;
        do {
            randomAcronymIndex = random.nextInt(numberOfAcronyms);
        } while (!askedIndices.add(randomAcronymIndex));
        Acronyms randomAcronym = allAcronyms.get(randomAcronymIndex);
        String fullQuestion = "What does " + randomAcronym.getAcronym() + " stand for?";
        return fullQuestion;
    }

}
