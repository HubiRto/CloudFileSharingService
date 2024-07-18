package pl.pomoku.cloudfilesharingservice.exception.user;

import org.springframework.http.HttpStatus;
import pl.pomoku.cloudfilesharingservice.exception.AppException;

public class UserAlreadyExistException extends AppException {
    public UserAlreadyExistException(String email) {
        super(String.format("User with email: %s, already exist", email), HttpStatus.BAD_REQUEST);
    }
}
