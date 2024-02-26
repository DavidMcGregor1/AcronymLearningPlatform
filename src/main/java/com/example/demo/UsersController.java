package com.example.demo;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.net.URL;
import java.util.*;
import java.util.Base64;
import javax.crypto.SecretKey;

@Controller
public class UsersController {

    public UsersController(UsersRepository u) {
        repositoryUsers = u;
    }

    private UsersRepository repositoryUsers;
    private SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

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

    @PostMapping(path = "/login")
    @ResponseBody
    public String login(@RequestParam("submittedUsername") String submittedUsername, @RequestParam("submittedPassword") String submittedPassword) {
        System.out.println("hit login");
        System.out.println("username: -> ]" + submittedUsername + "[");
        System.out.println("password: -> ]" + submittedPassword + "[");

        Optional<Users> userOptional = repositoryUsers.findByUsername(submittedUsername);
        System.out.println("userOptional -> " + userOptional);
        System.out.println("userOptional -> " + userOptional.toString());

        if (userOptional.isPresent()) {
            System.out.println("userOptional -> " + userOptional);
            System.out.println("user is present");
            Users user = userOptional.get();
            System.out.println("user -> " + user);
            if (user.getPassword().equals(submittedPassword)) {
                System.out.println("inputted password = user password");
                String jwt = generateJWT(user.getUsername());
                System.out.println("jwt -> " + jwt);
                return jwt;
            }
            System.out.println("inputted password does not equal user password");
        }
        System.out.println("user is not present");
        return null;
    }

    private boolean isAuthenticated(HttpServletRequest request) {
        String jwt = request.getHeader("Authorization");

        if (jwt != null && jwt.startsWith("Bearer ")) {
            String token = jwt.substring(7);
            try {
                Jws<Claims> claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
                return true;
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }

    private String generateJWT(String username) {
        System.out.println("Called generateJWT method");

        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);
        Date expiration = new Date(System.currentTimeMillis() + 3600 * 1000);
        String token = Jwts.builder()
                .setClaims(claims)
                .setExpiration(expiration)
                .signWith(secretKey)
                .compact();
        System.out.println("Token -> " + token);
        return token;
    }
}

