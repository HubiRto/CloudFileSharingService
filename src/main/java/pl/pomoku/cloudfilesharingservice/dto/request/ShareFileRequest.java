package pl.pomoku.cloudfilesharingservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShareFileRequest {
    private Long id;
    private String email;
}
