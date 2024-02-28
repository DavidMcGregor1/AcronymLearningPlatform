package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
public class HomePageController {

    // Return the homePage html page
    @GetMapping(path = "/homePage")
    public String homePage() {
        return "homePage";
    }
}
