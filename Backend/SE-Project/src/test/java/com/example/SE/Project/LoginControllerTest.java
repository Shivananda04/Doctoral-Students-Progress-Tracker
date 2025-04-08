package com.example.SE.Project;

// Import the LoginController class

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.ui.Model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import com.example.SE.Project.Controller.LoginController;

public class LoginControllerTest {

    @Test
    public void testLoginWithError() {
        // Arrange
        LoginController loginController = new LoginController();
        Model model = Mockito.mock(Model.class);
        String error = "Invalid credentials";

        // Act
        String viewName = loginController.login(error, model);

        // Assert
        assertEquals("login", viewName); // Ensure the view name is "login"
        verify(model, times(1)).addAttribute("error", error); // Verify the error is added to the model
    }

    @Test
    public void testLoginWithoutError() {
        // Arrange
        LoginController loginController = new LoginController();
        Model model = Mockito.mock(Model.class);

        // Act
        String viewName = loginController.login(null, model);

        // Assert
        assertEquals("login", viewName); // Ensure the view name is "login"
        verify(model, never()).addAttribute(eq("error"), any()); // Verify no error is added to the model
    }
}
