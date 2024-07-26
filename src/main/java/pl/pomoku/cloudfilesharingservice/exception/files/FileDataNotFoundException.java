package pl.pomoku.cloudfilesharingservice.exception.files;

import org.springframework.http.HttpStatus;
import pl.pomoku.cloudfilesharingservice.exception.AppException;

public class FileDataNotFoundException extends AppException {
    public FileDataNotFoundException(Long id) {
        super("File/Folder with id %d does not exist".formatted(id), HttpStatus.NOT_FOUND);
    }
}
