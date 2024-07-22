package pl.pomoku.cloudfilesharingservice.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddFolderRequest {
    @NotNull(message = "Folder Name cannot be null")
    @NotEmpty(message = "Folder Name cannot be empty")
    private String name;
    @NotNull(message = "Path cannot be null")
    @NotEmpty(message = "Path cannot be empty")
    private String path;
}
