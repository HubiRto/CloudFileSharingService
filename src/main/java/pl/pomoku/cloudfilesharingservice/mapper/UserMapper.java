package pl.pomoku.cloudfilesharingservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.pomoku.cloudfilesharingservice.dto.request.RegisterRequest;
import pl.pomoku.cloudfilesharingservice.dto.response.UserResponse;
import pl.pomoku.cloudfilesharingservice.entity.User;

@Mapper(componentModel = "spring")
public abstract class UserMapper {
    @Autowired
    protected PasswordEncoder passwordEncoder;

    @Mappings({
            @Mapping(target = "password", expression = "java(passwordEncoder.encode(request.getPassword()))"),
            @Mapping(target = "role", constant = "USER"),
            @Mapping(target = "isAccountNonExpired", constant = "true"),
            @Mapping(target = "isAccountNonLocked", constant = "true"),
            @Mapping(target = "isCredentialsNonExpired", constant = "true"),
            @Mapping(target = "isEnabled", constant = "true"),
            @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())"),
            @Mapping(target = "storageSize", constant = "10")
    })
    public abstract User toUser(RegisterRequest request);

    public abstract UserResponse userToUserResponse(User user);
}
