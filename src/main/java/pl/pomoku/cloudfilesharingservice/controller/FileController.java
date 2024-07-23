package pl.pomoku.cloudfilesharingservice.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pomoku.cloudfilesharingservice.dto.request.AddFolderRequest;
import pl.pomoku.cloudfilesharingservice.dto.response.FileMetadataResponse;
import pl.pomoku.cloudfilesharingservice.entity.FileMetadata;
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
    public ResponseEntity<FileMetadataResponse> addFolder(
            @NotNull(message = "Token cannot be null")
            @NotEmpty(message = "Token cannot be empty")
            @RequestHeader("Authorization") String token,
            @RequestBody AddFolderRequest request
    ) {
        return ResponseEntity.ok(filesMapper.mapToResponse(fileMetadataService.addFolder(request, token)));
    }

    @GetMapping("/files/path")
    public ResponseEntity<Page<FileMetadataResponse>> getFiles(
            @NotNull(message = "Token cannot be null")
            @NotEmpty(message = "Token cannot be empty")
            @RequestHeader("Authorization") String token,
            @RequestParam(value = "path", required = false) String path,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Page<FileMetadata> filePage = fileMetadataService.findAllByPathAndToken(path, token, PageRequest.of(page, size));
        Page<FileMetadataResponse> responsePage = filePage.map(filesMapper::mapToResponse);
        return ResponseEntity.ok(responsePage);
    }

    @GetMapping("/files/context")
    public ResponseEntity<Page<FileMetadataResponse>> getFilesByContext(
            @NotNull(message = "Token cannot be null")
            @NotEmpty(message = "Token cannot be empty")
            @RequestHeader("Authorization") String token,
            @RequestParam(value = "context") String context,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Page<FileMetadata> filePage = fileMetadataService.findAllByNameContainingAndToken(context, token, PageRequest.of(page, size));
        Page<FileMetadataResponse> responsePage = filePage.map(filesMapper::mapToResponse);
        return ResponseEntity.ok(responsePage);
    }
}
