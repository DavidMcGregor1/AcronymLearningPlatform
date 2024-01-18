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

    // TEST CATEGORY AND LENGTH SCENARIO 1

    @Test
    void testGetAcronymsByCategoryAndLengthTech3() throws Exception {
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

        // TEST CATEGORY AND LENGTH SCENARIO 2

    @Test
    void testGetAcronymsByCategoryAndLengthTech4() throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/acronymsByCategoryAndLength")
                        .param("category", "Tech")
                        .param("length", "4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("Tech"))
                .andExpect(jsonPath("$[0].length").value(4))
                .andReturn();
        String expectedOutput = "Expected: Tech, 4"; // Adjust based on your expectations
        String actualOutput = "Actual: " + result.getResponse().getContentAsString();
        logger.info(expectedOutput);
        logger.info(actualOutput);
        String responseBody = result.getResponse().getContentAsString();
        logger.info("Response Body: {}", responseBody);
    }

        // TEST CATEGORY AND LENGTH SCENARIO 3


    @Test
    void testGetAcronymsByCategoryAndLengthBusiness3() throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/acronymsByCategoryAndLength")
                        .param("category", "Business")
                        .param("length", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("Business"))
                .andExpect(jsonPath("$[0].length").value(3))
                .andReturn();
        String expectedOutput = "Expected: Business, 3"; // Adjust based on your expectations
        String actualOutput = "Actual: " + result.getResponse().getContentAsString();
        logger.info(expectedOutput);
        logger.info(actualOutput);
        String responseBody = result.getResponse().getContentAsString();
        logger.info("Response Body: {}", responseBody);
    }

        // TEST CATEGORY AND LENGTH SCENARIO 4

    @Test
    void testGetAcronymsByCategoryAndLengthBusiness4() throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/acronymsByCategoryAndLength")
                        .param("category", "Business")
                        .param("length", "4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("Business"))
                .andExpect(jsonPath("$[0].length").value(4))
                .andReturn();
        String expectedOutput = "Expected: Business, 4"; // Adjust based on your expectations
        String actualOutput = "Actual: " + result.getResponse().getContentAsString();
        logger.info(expectedOutput);
        logger.info(actualOutput);
        String responseBody = result.getResponse().getContentAsString();
        logger.info("Response Body: {}", responseBody);
    }

    @Test
    void testGetAcronymsWithNullCategory() throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/acronymsByCategoryAndLength")
                        .param("category", (String) "all")  // Set category to null
                        .param("length", "3"))
                .andExpect(status().isOk())
                .andReturn();

        String expectedOutput = "Expected: 200";
        String actualOutput = "Actual: " + result.getResponse().getStatus();
        logger.info(expectedOutput);
        logger.info(actualOutput);

        String responseBody = result.getResponse().getContentAsString();

        logger.info("Response Body: {}", responseBody);
    }


    @Test
    void testGetAcronymsWithNullLength() throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/acronymsByCategoryAndLength")
                        .param("category", (String) "Tech")  // Set category to null
                        .param("length", "-1"))
                .andExpect(status().isOk())
                .andReturn();

        String expectedOutput = "Expected: 200";
        String actualOutput = "Actual: " + result.getResponse().getStatus();
        logger.info(expectedOutput);
        logger.info(actualOutput);

        String responseBody = result.getResponse().getContentAsString();

        logger.info("Response Body: {}", responseBody);
    }
}
