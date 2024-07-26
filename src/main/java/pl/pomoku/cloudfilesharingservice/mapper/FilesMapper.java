package pl.pomoku.cloudfilesharingservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import pl.pomoku.cloudfilesharingservice.dto.response.FileMetadataResponse;
import pl.pomoku.cloudfilesharingservice.entity.FileMetadata;

@Mapper(componentModel = "spring")
public interface FilesMapper {
    @Mappings({
            @Mapping(source = "createdBy.fullName", target = "owner"),
    })
    FileMetadataResponse mapToResponse(FileMetadata fileMetadata);
}
