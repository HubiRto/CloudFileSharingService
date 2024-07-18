package pl.pomoku.cloudfilesharingservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import pl.pomoku.cloudfilesharingservice.dto.request.LoginRequest;
import pl.pomoku.cloudfilesharingservice.dto.request.RegisterRequest;
import pl.pomoku.cloudfilesharingservice.dto.response.AuthResponse;
import pl.pomoku.cloudfilesharingservice.entity.Token;
import pl.pomoku.cloudfilesharingservice.entity.User;
import pl.pomoku.cloudfilesharingservice.exception.AppException;
import pl.pomoku.cloudfilesharingservice.exception.token.InvalidTokenException;
import pl.pomoku.cloudfilesharingservice.exception.token.TokenNotFoundException;
import pl.pomoku.cloudfilesharingservice.exception.user.UserAlreadyExistException;
import pl.pomoku.cloudfilesharingservice.exception.user.UserNotFoundException;
import pl.pomoku.cloudfilesharingservice.mapper.UserMapper;
import pl.pomoku.cloudfilesharingservice.repositry.TokenRepository;
import pl.pomoku.cloudfilesharingservice.repositry.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;
    private final UserMapper userMapper;

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())){
            throw new UserAlreadyExistException(request.getEmail());
        }
        userRepository.save(userMapper.toUser(request));
    }

    public AuthResponse authenticate(LoginRequest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException(request.getEmail()));

        var auth = authenticationManager.authenticate(buildAuthToken(request));

        if (auth.isAuthenticated()) {
            String jwtToken = jwtService.generateToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);
            revokeAllUserTokens(user);
            tokenRepository.save(new Token(jwtToken, user));
            return new AuthResponse(jwtToken, refreshToken);
        } else {
            throw new AppException("Invalid username or password", HttpStatus.UNAUTHORIZED);
        }
    }

    public AuthResponse generateNewTokensByRefreshToken(String refreshToken) {
        String email = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new InvalidTokenException();
        }

        String newToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        tokenRepository.save(new Token(newToken, user));
        return new AuthResponse(newToken, refreshToken);
    }

    public boolean isTokenValid(String token) {
        Token jwtToken = tokenRepository.findByToken(token)
                .orElseThrow(TokenNotFoundException::new);

        String email = jwtService.extractUsername(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        return jwtService.isTokenValid(token, user)
                && !jwtToken.isExpired() && !jwtToken.isRevoked();
    }

    private void revokeAllUserTokens(User user) {
        List<Token> validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty()) return;

        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    private UsernamePasswordAuthenticationToken buildAuthToken(LoginRequest request) {
        return new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
    }
}