package pl.pomoku.cloudfilesharingservice.controller;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pl.pomoku.cloudfilesharingservice.dto.request.CreateArchiveRequest;
import pl.pomoku.cloudfilesharingservice.dto.response.FileMetadataResponse;
import pl.pomoku.cloudfilesharingservice.mapper.FilesMapper;
import pl.pomoku.cloudfilesharingservice.service.ArchiveService;

@RestController
@RequestMapping("/api/v1/files/archive")
@RequiredArgsConstructor
@Validated
public class ArchiveController {
    private final FilesMapper filesMapper;
    private final ArchiveService archiveService;

    @PostMapping("/archive/compress")
    public ResponseEntity<FileMetadataResponse> createArchive(
            @NotNull(message = "Token cannot be null")
            @NotEmpty(message = "Token cannot be empty")
            @RequestHeader("Authorization") String token,
            @RequestBody CreateArchiveRequest request
    ) {
        return ResponseEntity.ok(filesMapper.mapToResponse(archiveService.createCompressedArchive(request, token)));
    }

//    @PostMapping("/archive/decompress/{id}")
//    public ResponseEntity<FileMetadataResponse> createArchive(
//            @NotNull(message = "Token cannot be null")
//            @NotEmpty(message = "Token cannot be empty")
//            @RequestHeader("Authorization") String token,
//            @PathVariable("id") Long id,
//            @RequestParam String path
//    ) {
//        return ResponseEntity.ok(filesMapper.mapToResponse());
//    }
}
