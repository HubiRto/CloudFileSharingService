package pl.pomoku.cloudfilesharingservice.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pomoku.cloudfilesharingservice.dto.request.AddFolderRequest;
import pl.pomoku.cloudfilesharingservice.dto.response.FileMetadataResponse;
import pl.pomoku.cloudfilesharingservice.mapper.FilesMapper;
import pl.pomoku.cloudfilesharingservice.service.FileMetadataService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Validated
public class FileController {
    private final FilesMapper filesMapper;
    private final FileMetadataService fileMetadataService;

    @Transactional
    @PostMapping("/upload")
    public ResponseEntity<List<FileMetadataResponse>> uploadFiles(
            @NotNull(message = "Token cannot be null")
            @NotEmpty(message = "Token cannot be empty")
            @RequestHeader("Authorization") String token,

            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("path") String path
    ) throws IOException {
        return ResponseEntity.ok(fileMetadataService.uploadFiles(files, path, token)
                .stream().map(filesMapper::mapToResponse).toList());
    }

    @PostMapping("/folders/add")
    public ResponseEntity<String> addFolder(
            @NotNull(message = "Token cannot be null")
            @NotEmpty(message = "Token cannot be empty")
            @RequestHeader("Authorization") String token,
            @RequestBody AddFolderRequest request
    ) {
        fileMetadataService.addFolder(request, token);
        return ResponseEntity.ok("Successfully added folder");
    }

    @GetMapping
    public ResponseEntity<List<FileMetadataResponse>> getFiles(
            @NotNull(message = "Token cannot be null")
            @NotEmpty(message = "Token cannot be empty")
            @RequestHeader("Authorization") String token,
            @RequestParam(value = "path") String path
    ) {
        return ResponseEntity.ok(fileMetadataService.findAllByPathAndToken(path, token)
                .stream().map(filesMapper::mapToResponse).toList());
    }
}
