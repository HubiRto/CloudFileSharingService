package pl.pomoku.cloudfilesharingservice.exception.token;

import org.springframework.http.HttpStatus;
import pl.pomoku.cloudfilesharingservice.exception.AppException;

public class InvalidTokenException extends AppException {
    public InvalidTokenException() {
        super("Invalid token", HttpStatus.BAD_REQUEST);
    }
}