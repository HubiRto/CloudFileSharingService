package pl.pomoku.cloudfilesharingservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileMetadataResponse {
    private Long id;
    private String name;
    private String path;
    private boolean isFolder;
    private String mime;
    private long size;
    private LocalDateTime createdAt;
}
