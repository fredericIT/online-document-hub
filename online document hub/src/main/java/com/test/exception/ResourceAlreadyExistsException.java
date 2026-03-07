package com.test.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(HttpStatus.CONFLICT)
public class ResourceAlreadyExistsException extends RuntimeException {
    private final String resource;
    private final String identifier;

    public ResourceAlreadyExistsException(String resource, String identifier) {
        super(String.format("%s already exists: %s", resource, identifier));
        this.resource = resource;
        this.identifier = identifier;
    }
}
