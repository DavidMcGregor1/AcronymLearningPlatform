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
import java.util.Optional;

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
    Acronyms acronym2 = new Acronyms("Business", 3, "ISA","Individual Savings Account", "Independent Savings Account", "Investment Savings Account", "Independent System Access", "This is a description for individual savings account");
    Acronyms acronym3 = new Acronyms("Tech", 4, "HTML","Hyper Text Markup Language", "High-Tech Media Link", "Hybrid Template Markup Logic", "Hyper Text Media Link", "This is a description for hyper text markup language");
    Acronyms acronym4 = new Acronyms("Business", 3, "NBA","Nominated Bank Account", "Non-Banking Assets", "New Business Asset", "Net Balance Adjustments", "This is a description for nominated bank account");
    Acronyms acronym5 = new Acronyms("Business", 4, "PAYE","Pay As You Earn", "Pay After Year End", "Premium Asset Yield Evaluation", "Professional Advisory Year End", "This is a description for Ppay as you earn");


    @BeforeAll
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.mockMvc = MockMvcBuilders.standaloneSetup(acronymsController).build();
    }

    @Test
    public void getAllAcronyms_success() throws Exception {
        System.out.println("inside getAllAcronyms_success");
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
        System.out.println("inside testGetAcronymsbyCategoryAndLength");

        List<Acronyms> acronyms = new ArrayList<>(Arrays.asList(acronym1, acronym2));
        when(repositoryAcronyms.findByCategoryIgnoreCaseAndLength("Tech", 3)).thenReturn(acronyms);


        mockMvc.perform(MockMvcRequestBuilders
                .get("/acronymsByCategoryAndLength")
                .param("category", "Tech")
                .param("length", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2))) // Assuming you expect two acronyms
                .andExpect(jsonPath("$[0].category", is("Tech")))
                .andExpect(jsonPath("$[0].length", is(3)))
                .andExpect(jsonPath("$[1].category", is("Business")))
                .andExpect(jsonPath("$[1].length", is(3)));
    }

    @Test
    public void testGetAcronymByCategoryAndLengthBusiness3() throws Exception {
        System.out.println("inside testGetAcronymsbyCategoryAndLength");

        List<Acronyms> acronyms = new ArrayList<>(Arrays.asList(acronym1, acronym2, acronym3, acronym4, acronym5));
        when(repositoryAcronyms.findByCategoryIgnoreCaseAndLength("Business", 3)).thenReturn(acronyms);


        mockMvc.perform(MockMvcRequestBuilders
                        .get("/acronymsByCategoryAndLength")
                        .param("category", "Business")
                        .param("length", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5))) // Assuming you expect two acronyms
                .andExpect(jsonPath("$[3].category", is("Business")))
                .andExpect(jsonPath("$[3].length", is(3)));
    }

}