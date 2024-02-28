package com.example.demo;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import javax.crypto.SecretKey;

@Controller
public class UsersController {

    public UsersController(UsersRepository u) {
        repositoryUsers = u;
    }

    private UsersRepository repositoryUsers;
    private SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Endpoint to return all the users in the database
    @GetMapping(path = "/getAllUsers")
    @ResponseBody
    public String getAllUsers() {
        System.out.println("inside getAllUsers Method");
        System.out.println("Secret key -> " + secretKey);
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

    // takes in a username and password and checks to see if the username and password is correct
    @PostMapping(path = "/login")
    @ResponseBody
    public String login(@RequestParam("submittedUsername") String submittedUsername, @RequestParam("submittedPassword") String submittedPassword) {
        Optional<Users> userOptional = repositoryUsers.findByUsername(submittedUsername);

        if (userOptional.isPresent()) {

            Users user = userOptional.get();
            // If the username and password is correct, generate a jwt and return it
            if (user.getPassword().equals(submittedPassword)) {
                String jwt = generateJWT(user.getUsername());
                return jwt;
            }
        }
        return null;
    }

    // Generates a Json Web Token using a secret key
    private String generateJWT(String username) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);
        Date expiration = new Date(System.currentTimeMillis() + 3600 * 1000);
        String token = Jwts.builder()
                .setClaims(claims)
                .setExpiration(expiration)
                .signWith(secretKey)
                .compact();
        return token;
    }
}

