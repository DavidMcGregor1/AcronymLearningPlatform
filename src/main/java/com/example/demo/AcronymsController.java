package com.example.demo;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@Controller
public class AcronymsController {
    public AcronymsController(AcronymsRepository a) {
        repositoryAcronyms = a;
    }

    private AcronymsRepository repositoryAcronyms;

    // Gets all the acronyms in the database and returns the result
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

    // Returns the learnPage html page
    @GetMapping(path = "/learnPage")
    public String learnPage(Model model) {
        List<Acronyms> allAcronyms = repositoryAcronyms.findAll();

        // Sorts the acronyms by alphabetical order
        List<Acronyms> sortedAcronyms = allAcronyms.stream().sorted(Comparator.comparing(Acronyms::getAcronym)).collect(Collectors.toList());

        model.addAttribute("acronyms", sortedAcronyms);
        return "learnPage";
    }

    // Gets the takes in the id of an acronym and returns the meaning and description properties of that acronym
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

    // Returns a list of acronyms based on category and length parameters that are passed in
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

    // Takes in the parameters for a new acronym and adds it to the database
    @PostMapping(path = "/addAcronym")
    @ResponseBody
    public ResponseEntity addAcronym(HttpServletRequest request, @RequestBody AcronymsVm submittedAcronym) {

        if (!isAuthenticated(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        // Create a new acronym with the inputted properties
        Acronyms newAcronym = new Acronyms();
        String acronym = submittedAcronym.acronym.toUpperCase();
        newAcronym.setAcronym(acronym);
        newAcronym.setMeaning(submittedAcronym.meaning);
        newAcronym.setCategory(submittedAcronym.category);
        newAcronym.setLength(submittedAcronym.length);
        newAcronym.setDescription(submittedAcronym.description);

        // Save the new acronym to the database
        repositoryAcronyms.save(newAcronym);

        return ResponseEntity.ok(submittedAcronym);
    }

    // Admin endpoint for me to add new acronyms to the database
    @PostMapping(path = "/addAcronymWithFalseAnswers")
    @ResponseBody
    public ResponseEntity addAcronymWithFalseAnswers(HttpServletRequest request, @RequestBody AcronymsVm submittedAcronym) {
        Acronyms newAcronym = new Acronyms();
        String acronym = submittedAcronym.acronym.toUpperCase();
        newAcronym.setAcronym(acronym);
        newAcronym.setMeaning(submittedAcronym.meaning);
        newAcronym.setCategory(submittedAcronym.category);
        newAcronym.setLength(submittedAcronym.length);
        newAcronym.setDescription(submittedAcronym.description);
        newAcronym.setFalseAnswer1(submittedAcronym.falseAnswer1);
        newAcronym.setFalseAnswer2(submittedAcronym.falseAnswer2);
        newAcronym.setFalseAnswer3(submittedAcronym.falseAnswer3);

        repositoryAcronyms.save(newAcronym);

        return ResponseEntity.ok(submittedAcronym);
    }

    // Takes in a string to replace the current description of a selected acronym with
    @PutMapping(path = "editAcronymDescription")
    @ResponseBody
    public ResponseEntity editAcronymDescription(HttpServletRequest request, @RequestBody Acronyms editRequest) {
        // If the user is not logged in, return a 401 unauthorised
        if (!isAuthenticated(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        if (editRequest.getDescription() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        Optional<Acronyms> optionalAcronym = repositoryAcronyms.findById(editRequest.getId());

        if (optionalAcronym.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Acronyms acronym = optionalAcronym.get();
        // Update the description   
        acronym.setDescription(editRequest.getDescription());
        // Save the updated acronym to the database
        repositoryAcronyms.save(acronym);
        return ResponseEntity.ok(acronym);
    }

    // Takes in the http request and checks if the usr is logged in
    private boolean isAuthenticated(HttpServletRequest request) {
        String jwt = request.getHeader("Authorization");
        System.out.println("Authorization header value: " + jwt); // Add logging statement

        // Checks if the request header has the jwt in and returns true if it does, and false if not
        if (jwt != null && jwt.startsWith("Bearer ")) {
            return true;
        }
        return false;
    }
}
