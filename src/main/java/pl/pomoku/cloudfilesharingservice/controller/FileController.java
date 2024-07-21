package pl.pomoku.cloudfilesharingservice.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pomoku.cloudfilesharingservice.entity.FileMetadata;
import pl.pomoku.cloudfilesharingservice.repositry.FileMetadataRepository;
import pl.pomoku.cloudfilesharingservice.service.UserService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {
    private final FileMetadataRepository fileMetadataRepository;
    private final UserService userService;
    public static final String DIRECTORY = System.getProperty("user.home") + "/uploads";

    @Transactional
    @PostMapping("/upload")
    public ResponseEntity<List<String>> uploadFiles(
            @RequestParam("files") List<MultipartFile> files,
            @NotNull(message = "Token cannot be null")
            @NotEmpty(message = "Token cannot be empty")
            @RequestHeader("Authorization") String token
    ) throws IOException {
        List<String> fileNames = new ArrayList<>();
        for (MultipartFile file : files) {
            fileMetadataRepository.save(
                FileMetadata.builder()
                        .name(file.getOriginalFilename())
                        .path("http://127.0.0.1:8080/api/v1/files/" + file.getOriginalFilename())
                        .isFolder(false)
                        .mime(file.getContentType())
                        .size(file.getSize())
                        .createdAt(LocalDateTime.now())
                        .createdBy(userService.getUserFromToken(token))
                        .build()
            );

            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            Path filePath = Paths.get(DIRECTORY, fileName).toAbsolutePath().normalize();
            Files.copy(file.getInputStream(), filePath, REPLACE_EXISTING);
            fileNames.add("http://127.0.0.1:8080/api/v1/files/" + fileName);
        }
        return ResponseEntity.ok().body(fileNames);
    }
}
