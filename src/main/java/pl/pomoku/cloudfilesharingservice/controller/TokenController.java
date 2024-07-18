package pl.pomoku.cloudfilesharingservice.controller;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.pomoku.cloudfilesharingservice.dto.response.AuthResponse;
import pl.pomoku.cloudfilesharingservice.service.AuthService;

@RestController
@RequestMapping("/api/v1/auth/token")
@RequiredArgsConstructor
@Validated
public class TokenController {
    private final AuthService authService;

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(
            @NotNull(message = "Token cannot be null")
            @NotEmpty(message = "Token cannot be empty")
            @Param("token") String refreshToken
    ) {
        return new ResponseEntity<>(
                authService.generateNewTokensByRefreshToken(refreshToken),
                HttpStatus.OK
        );
    }

    @PostMapping("/validate-token")
    public ResponseEntity<Boolean> validateToken(
            @NotNull(message = "Token cannot be null")
            @NotEmpty(message = "Token cannot be empty")
            @Param("token") String token
    ) {
        return new ResponseEntity<>(
                authService.isTokenValid(token),
                HttpStatus.ACCEPTED
        );
    }
}
