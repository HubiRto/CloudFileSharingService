package pl.pomoku.cloudfilesharingservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DeleteFilesRequest {
    private Long[] ids;
}
