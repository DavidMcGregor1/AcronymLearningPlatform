package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
public class HomePageController {
    @GetMapping(path = "/homePage")
    public String homePage() {
        return "homePage";
    }
}
