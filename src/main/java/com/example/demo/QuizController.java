package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;
import java.util.Random;

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
        String result = "All Aronyms ---> ";
        for (int i = 0; i < allAcronyms.stream().count(); i++) {
            Acronyms a = allAcronyms.get(i);
            if (a != null ) {
                result += a.getAcronym() + ", ";
            }
        }
        Random random = new Random();
        int randomAcronymIndex = random.nextInt(allAcronyms.toArray().length) + 1;
        String fullQuestion = "What does " + ((Acronyms)allAcronyms.toArray()[randomAcronymIndex]).getAcronym() + " stand for?";
//        return fullQuestion;
        return result;
    }

}
