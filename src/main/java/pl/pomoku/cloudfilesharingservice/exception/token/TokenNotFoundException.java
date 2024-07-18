package pl.pomoku.cloudfilesharingservice.exception.token;

import org.springframework.http.HttpStatus;
import pl.pomoku.cloudfilesharingservice.exception.AppException;

public class TokenNotFoundException extends AppException {
    public TokenNotFoundException() {
        super("Token not found", HttpStatus.NOT_FOUND);
    }
}
