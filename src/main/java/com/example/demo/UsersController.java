package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
public class UsersController {
    public UsersController(UsersRepository u) {
        repositoryUsers = u;
    }

    private UsersRepository repositoryUsers;


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
        System.out.println("submitted username = " + submittedUsername);
        System.out.println("submitted password =  " + submittedPassword);
        Optional<Users> userOptional = repositoryUsers.findByUsername(submittedUsername);
        if (userOptional.isPresent()) {
            System.out.println("inside useroptional present if");
            Users user = userOptional.get();
            System.out.println(user.getPassword());
            if (user.getPassword().equals(submittedPassword)) {
                System.out.println("inside successful");
                return "login successful";
            }
        }

        return "invalid username or password";
    }

}
