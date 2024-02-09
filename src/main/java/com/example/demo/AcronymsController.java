package com.example.demo;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.*;

@Controller
public class AcronymsController {
    public AcronymsController(AcronymsRepository a) {
        repositoryAcronyms = a;
    }

    private static final String SECRET_KEY = "IjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6Ikph";

    private AcronymsRepository repositoryAcronyms;

    @GetMapping
    public List<Acronyms> getAllAcronymsTest() {
        return repositoryAcronyms.findAll();
    }

    @RequestMapping
    String getHelloWorld() {
        return "helloworld!";
    }



    @GetMapping(path = "/getAllAcronyms")
    @ResponseBody
    public String getAllAcronyms() {
        List<Acronyms> allAcronyms = repositoryAcronyms.findAll();
        String result = "All Acronyms ---> ";
        for (int i = 0; i < allAcronyms.stream().count(); i++) {
            Acronyms a = allAcronyms.get(i);
            if (a != null ) {
                result += a.getAcronym() + ", ";
            }
        }
        return result;
    }

    @GetMapping(path = "/learnPage")
    public String learnPage(Model model) {
        List<Acronyms> allAcronyms = repositoryAcronyms.findAll();
        model.addAttribute("acronyms", allAcronyms);
        return "learnPage";
    }

    //GET ACRONYM MEANING AND DESCRIPTION BY ID
    @ResponseStatus(value = HttpStatus.OK)
    @ResponseBody
    @PostMapping(path = "/getAcronymMeaningAndDescriptionById")
    public AcronymsVm getAcronymMeaningAndDescriptionById(@RequestBody AcronymsVm submittedId) {
        Optional<Acronyms> acronymId = repositoryAcronyms.findById(submittedId.id);

        AcronymsVm result = new AcronymsVm();
        result.acronym = acronymId.get().getAcronym();
        result.meaning = acronymId.get().getMeaning();
        result.description = acronymId.get().getDescription();
        return result;
    }

    @GetMapping(path = "/acronymsByCategoryAndLength")
    @ResponseBody
    public List<Acronyms> getAcronymsByCategoryAndLength(
            @RequestParam(name = "category") String category,
            @RequestParam(name = "length") int length) {
            List<Acronyms> acronyms;

        if(length == -1) {
            if(category.equals("all")) {
                acronyms = repositoryAcronyms.findAll();
            } else {
                //length is -1 and category is specified - get by category
                acronyms = repositoryAcronyms.findByCategoryIgnoreCase(category);

            }
        } else {
            if(category.equals("all")) {
                // get by length and ignore category
                acronyms = repositoryAcronyms.findByLength(length);
            } else {
                //get by length and category
                acronyms = repositoryAcronyms.findByCategoryIgnoreCaseAndLength(category, length);
            }

        }



        return acronyms;
    }

    @PostMapping(path = "/addAcronym")
    @ResponseBody
    public ResponseEntity addAcronym(HttpServletRequest request, @RequestBody AcronymsVm submittedAcronym) {
        if (!isAuthenticated(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        System.out.println("Hit addAcronym API");
        Acronyms newAcronym = new Acronyms();
        newAcronym.setAcronym(submittedAcronym.acronym);
        newAcronym.setMeaning(submittedAcronym.meaning);
        newAcronym.setCategory(submittedAcronym.category);
        newAcronym.setLength(submittedAcronym.length);
        newAcronym.setDescription(submittedAcronym.description);

        repositoryAcronyms.save(newAcronym);

        return ResponseEntity.ok(submittedAcronym);
    }

    private boolean isAuthenticated(HttpServletRequest request) {
        String jwt = request.getHeader("Authorisation");
        if (jwt != null && jwt.startsWith("Bearer ")) {
            String token = jwt.substring(7);
            try {
                Jws<Claims> claims = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
                return true;
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }

}
