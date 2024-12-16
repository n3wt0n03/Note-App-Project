package edu.usc.noteapp.note_taking_system.config;

import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.DefaultResponseErrorHandler;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class CustomResponseErrorHandler extends DefaultResponseErrorHandler {

    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        String responseBody = new String(response.getBody().readAllBytes(), StandardCharsets.UTF_8);
        System.out.println("Custom Error Response Body: " + responseBody);
        super.handleError(response);
    }
}
