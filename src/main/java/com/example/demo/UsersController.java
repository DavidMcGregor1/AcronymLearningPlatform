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

}
