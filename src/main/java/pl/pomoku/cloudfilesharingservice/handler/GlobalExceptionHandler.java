package pl.pomoku.cloudfilesharingservice.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import pl.pomoku.cloudfilesharingservice.dto.response.ErrorResponse;
import pl.pomoku.cloudfilesharingservice.exception.AppException;
import pl.pomoku.cloudfilesharingservice.mapper.ExceptionMapper;

import javax.naming.AuthenticationException;

@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {
    private final ExceptionMapper exceptionMapper;

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorResponse> appExceptionHandler(AppException exception) {
        return ResponseEntity.status(exception.getStatus()).body(exceptionMapper.mapToResponse(exception));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<String> handleAuthenticationException(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed: " + ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<String> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String error = "Invalid parameter type: " + ex.getValue() + " should be of type " + ex.getRequiredType().getSimpleName();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}