package com.example.demo;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class UsersControllerTest {

    @Mock
    private UsersRepository usersRepositoryMock;

    @InjectMocks
    private UsersController usersController;

    @Test
    void testGetAllUsers() {
        List<Users> users = new ArrayList<>();
        users.add(new Users("user1", "password1"));
        users.add(new Users("user2", "password2"));

        when(usersRepositoryMock.findAll()).thenReturn(users);

        String result = usersController.getAllUsers();

        assertTrue(result.contains("user1"));
        assertTrue(result.contains("user2"));
        assertTrue(result.contains("password1"));
        assertTrue(result.contains("password2"));
    }

    @Test
    void testLoginFailure() {
        String submittedUsername = "david";
        String submittedPassword = "invalid_password";

        Users user = new Users("david", "david");
        when(usersRepositoryMock.findByUsername(submittedUsername)).thenReturn(Optional.of(user));

        String jwt = usersController.login(submittedUsername, submittedPassword);

        assertNull(jwt, "JWT should be null for invalid credentials");
    }

    @Test
    void testLoginSuccess() {
        String submittedUsername = "david";
        String submittedPassword = "david";

        Users user = new Users("david", "david");
        when(usersRepositoryMock.findByUsername(submittedUsername)).thenReturn(Optional.of(user));

        String jwt = usersController.login(submittedUsername, submittedPassword);

        assertNotNull(jwt, "JWT should not be null for valid credentials");
    }

}

