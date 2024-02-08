package com.example.demo;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.Optional;

@Controller
public class UsersController {
    public UsersController(UsersRepository u) {
        repositoryUsers = u;
    }

    private UsersRepository repositoryUsers;
    private static final String SECRET_KEY = "IjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6Ikph";


    @GetMapping(path = "/getAllUsers")
    @ResponseBody
    public String getAllUsers() {
        List<Users> allUsers = repositoryUsers.findAll();
        String result = "All Users ---> ";
        for (int i = 0; i < allUsers.stream().count(); i++) {
            Users a = allUsers.get(i);
            if (a != null ) {
                result += a.getUsername() + ", " + a.getPassword();
            }
        }
        return result;
    }

    @PostMapping(path = "/login")
    @ResponseBody
    public String login(@RequestParam("submittedUsername") String submittedUsername, @RequestParam("submittedPassword") String submittedPassword) {
        System.out.println("Hit login api");
        Optional<Users> userOptional = repositoryUsers.findByUsername(submittedUsername);
        if (userOptional.isPresent()) {
            Users user = userOptional.get();
            System.out.println("Submitted Password: " + submittedPassword);
            System.out.println("Password in database: " + user.getPassword());
            if (user.getPassword().equals(submittedPassword)) {
                System.out.println("Submitted Password: " + submittedPassword);
                System.out.println("Password in database: " + user.getPassword());
                String jwt = generateJWT(user.getUsername())
;                return jwt;
            }
        }

        System.out.println("Should be shown if user is not present in the database");
        return null;
    }



    private String generateJWT(String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);
        Date expiration = new Date(System.currentTimeMillis() + 3600 * 1000);
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(expiration)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();

    }

}
