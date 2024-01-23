package com.example.demo;

import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
public class AcronymsControllerTest {

        private static final Logger logger = LoggerFactory.getLogger(AcronymsControllerTest.class);

    MockMvc mockMvc;

    @Mock
    private AcronymsRepository repositoryAcronyms;

    @InjectMocks
    private AcronymsController acronymsController;

    Acronyms acronym1 = new Acronyms("Tech", 3, "MVP","Minimum Viable Product", "Minimum Version Product", "Multiple Versioned Product", "Minimum Viable Project", "This is a description for minimum viable product");
    Acronyms acronym2 = new Acronyms("Business", 3, "MVP","Minimum Viable Product", "Minimum Version Product", "Multiple Versioned Product", "Minimum Viable Project", "This is a description for minimum viable product");

    @BeforeAll
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.mockMvc = MockMvcBuilders.standaloneSetup(acronymsController).build();
    }

    @Test
    public void getAllAcronyms_success() throws Exception {
        List<Acronyms> acronyms = new ArrayList<>(Arrays.asList(acronym1, acronym2));

        Mockito.when(repositoryAcronyms.findAll()).thenReturn(acronyms);

        mockMvc.perform(MockMvcRequestBuilders
                .get("/getAllAcronyms")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(containsString("All Acronyms ---> MVP, MVP")));

    }

    @Test
    public void testGetAcronymByCategoryAndLengthTech3() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                .get("/acronymsByCategoryAndLength")
                .param("category", "Tecnh")
                .param("length", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(0)))// Allow an empty array
                .andExpect(jsonPath("$[0].category").doesNotExist()) // Ensure no category field
                .andExpect(jsonPath("$[0].length").doesNotExist());  // Ensure no length field
        
    }




}