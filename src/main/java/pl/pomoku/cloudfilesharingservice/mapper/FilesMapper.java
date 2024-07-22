package pl.pomoku.cloudfilesharingservice.mapper;

import org.mapstruct.Mapper;
import pl.pomoku.cloudfilesharingservice.dto.response.FileMetadataResponse;
import pl.pomoku.cloudfilesharingservice.entity.FileMetadata;

@Mapper(componentModel = "spring")
public interface FilesMapper {
    FileMetadataResponse mapToResponse(FileMetadata fileMetadata);
}
