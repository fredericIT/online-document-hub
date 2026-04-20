package com.test.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Forwards all non-API, non-static-resource requests to index.html
 * so that React Router can handle client-side routing.
 *
 * Without this, refreshing a page like /documents or /admin would
 * return a 404 because Spring Boot doesn't know about those routes.
 */
@Controller
public class SpaForwardingController {

    @GetMapping(value = {
        "/",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/unauthorized",
        "/upload",
        "/documents",
        "/admin",
        "/chat"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
