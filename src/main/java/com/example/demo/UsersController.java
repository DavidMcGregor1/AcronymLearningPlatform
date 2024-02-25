package com.example.demo;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.env.Environment;

import java.net.URL;
import java.util.*;
import java.util.Optional;

@Controller
public class UsersController {

    public UsersController(UsersRepository u, Environment env) {
        repositoryUsers = u;
        this.env = env;
    }

    private UsersRepository repositoryUsers;
    private final Environment env;

    @Value("${SECRET_KEY}")
    private String SECRET_KEY;


    @GetMapping(path = "/getAllUsers")
    @ResponseBody
    public String getAllUsers() {
        System.out.println("Secret key" + SECRET_KEY);
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
        Optional<Users> userOptional = repositoryUsers.findByUsername(submittedUsername);
        if (userOptional.isPresent()) {
            Users user = userOptional.get();
            if (user.getPassword().equals(submittedPassword)) {
                String jwt = generateJWT(user.getUsername());
                return jwt;
            }
        }
        return null;
    }

    private boolean isAuthenticated(HttpServletRequest request) {
        String jwt = request.getHeader("Authorization");

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
