package com.test.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(HttpStatus.FORBIDDEN)
public class AccessDeniedException extends RuntimeException {
    private final String resource;
    private final String action;

    public AccessDeniedException(String resource, String action) {
        super(String.format("Access denied to %s: %s", resource, action));
        this.resource = resource;
        this.action = action;
    }
}
