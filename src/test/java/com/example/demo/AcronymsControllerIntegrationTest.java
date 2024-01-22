package com.example.demo;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AcronymsControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AcronymsRepository repositoryAcronyms;

    @Test
    public void testGetAllAcronyms() throws Exception {
        Acronyms acronym1 = new Acronyms("Tech", 3, "MVP","Minimum Viable Product", "Minimum Version Product", "Multiple Versioned Product", "Minimum Viable Project", "This is a description for minimum viable product");
        Acronyms acronym2 = new Acronyms("Business", 4, "HTTP","Hyper Text Transfer Protocol", "Hyper Text Transmission Protocol", "Hidden Text Transfer Protocol", "Hyper Transfer Transmission Protocol", "This is a description for hyper text transfer protocol");

        List<Acronyms> mockAcronyms = Arrays.asList(acronym1, acronym2);
        when(repositoryAcronyms.findAll()).thenReturn(mockAcronyms);

        mockMvc.perform(get("/getAllAcronyms"))
                .andExpect(status().isOk())
                .andExpect(content().string("All Acronyms ---> MVP, HTTP, "));



    }
}
