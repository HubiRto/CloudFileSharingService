package pl.pomoku.cloudfilesharingservice.enumerated;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum TokenType {
    BEARER("Bearer ");

    private final String type;
}
