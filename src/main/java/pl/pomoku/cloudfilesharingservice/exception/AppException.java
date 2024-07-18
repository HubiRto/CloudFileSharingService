package pl.pomoku.cloudfilesharingservice.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

@Getter
public class AppException extends RuntimeException {
    private final HttpStatus status;
    private final Map<String, Object> details;

    public AppException(String message, HttpStatus status) {
        super(message);
        this.status = status;
        this.details = new HashMap<>();
    }
}
