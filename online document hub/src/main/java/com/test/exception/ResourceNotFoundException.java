package com.test.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    private final String resource;
    private final Long id;

    public ResourceNotFoundException(String resource, Long id) {
        super(String.format("%s not found with id: %d", resource, id));
        this.resource = resource;
        this.id = id;
    }

    public ResourceNotFoundException(String resource, String identifier) {
        super(String.format("%s not found: %s", resource, identifier));
        this.resource = resource;
        this.id = null;
    }
}
