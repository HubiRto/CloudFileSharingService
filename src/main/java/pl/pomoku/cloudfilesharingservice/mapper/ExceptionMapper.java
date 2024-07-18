package pl.pomoku.cloudfilesharingservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import pl.pomoku.cloudfilesharingservice.dto.response.ErrorResponse;
import pl.pomoku.cloudfilesharingservice.exception.AppException;

@Mapper(componentModel = "spring")
public interface ExceptionMapper {
    @Mappings({
            @Mapping(source = "message", target = "error"),
            @Mapping(target = "timestamp", expression = "java(java.time.LocalDateTime.now())")
    })
    ErrorResponse mapToResponse(AppException exception);
}
