package com.example.demo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class AcronymsControllerIntegrationTest {

    private static final Logger logger = LoggerFactory.getLogger(AcronymsControllerIntegrationTest.class);

    @Autowired
    private AcronymsController acronymsController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(acronymsController).build();
    }

    @Test
    void testGetAcronymsByCategoryAndLength() throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/acronymsByCategoryAndLength")
                        .param("category", "Tech")
                        .param("length", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("Tech"))
                .andExpect(jsonPath("$[0].length").value(3))
                .andReturn();

        String expectedOutput = "Expected: Tech, 3"; // Adjust based on your expectations
        String actualOutput = "Actual: " + result.getResponse().getContentAsString();
        logger.info(expectedOutput);
        logger.info(actualOutput);

        String responseBody = result.getResponse().getContentAsString();

        logger.info("Response Body: {}", responseBody);
    }
}
