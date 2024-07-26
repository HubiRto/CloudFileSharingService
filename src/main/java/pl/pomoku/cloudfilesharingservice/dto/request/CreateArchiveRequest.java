package pl.pomoku.cloudfilesharingservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateArchiveRequest {
    private String name;
    private String type;
    private String path;
    private Long[] ids;
}
