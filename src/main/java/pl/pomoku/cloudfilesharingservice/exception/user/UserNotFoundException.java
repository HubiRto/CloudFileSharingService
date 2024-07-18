package pl.pomoku.cloudfilesharingservice.exception.user;

import org.springframework.http.HttpStatus;
import pl.pomoku.cloudfilesharingservice.exception.AppException;

public class UserNotFoundException extends AppException {
    public UserNotFoundException(String email) {
        super("User with email: %s, does not exist".formatted(email), HttpStatus.NOT_FOUND);
    }
}
