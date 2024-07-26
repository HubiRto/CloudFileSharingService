package pl.pomoku.cloudfilesharingservice.controller;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pl.pomoku.cloudfilesharingservice.dto.request.ShareFileRequest;
import pl.pomoku.cloudfilesharingservice.dto.response.FileMetadataResponse;
import pl.pomoku.cloudfilesharingservice.entity.FileShare;
import pl.pomoku.cloudfilesharingservice.mapper.FilesMapper;
import pl.pomoku.cloudfilesharingservice.service.FileSharingService;

@RestController
@RequestMapping("/api/v1/files/share")
@RequiredArgsConstructor
@Validated
public class ShareController {
    private final FilesMapper filesMapper;
    private final FileSharingService fileSharingService;

    @GetMapping("/shared-by-me/path")
    public ResponseEntity<Page<FileMetadataResponse>> getShareByMePageByPath(
            @NotNull(message = "Token cannot be null")
            @NotEmpty(message = "Token cannot be empty")
            @RequestHeader("Authorization") String token,
            @RequestParam(value = "path") String path,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Page<FileShare> filePage = fileSharingService.getSharedFilesByPath(token, path, PageRequest.of(page, size));
        Page<FileMetadataResponse> responsePage = filePage.map((fileShare) -> filesMapper.mapToResponse(fileShare.getFile()));
        return ResponseEntity.ok(responsePage);
    }

    @GetMapping("/shared-by-me/context")
    public ResponseEntity<Page<FileMetadataResponse>> getShareByMePageByContext(
            @NotNull(message = "Token cannot be null")
            @NotEmpty(message = "Token cannot be empty")
            @RequestHeader("Authorization") String token,
            @RequestParam(value = "context") String context,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Page<FileShare> filePage = fileSharingService.getSharedFilesByContext(token, context, PageRequest.of(page, size));
        Page<FileMetadataResponse> responsePage = filePage.map((fileShare) -> filesMapper.mapToResponse(fileShare.getFile()));
        return ResponseEntity.ok(responsePage);
    }

    @GetMapping("/shared-with-me/path")
    public ResponseEntity<Page<FileMetadataResponse>> getShareWithMePageByPath(
            @NotNull(message = "Token cannot be null")
            @NotEmpty(message = "Token cannot be empty")
            @RequestHeader("Authorization") String token,
            @RequestParam(value = "path") String path,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Page<FileShare> filePage = fileSharingService.getSharedFilesByPath(token, path, PageRequest.of(page, size));
        Page<FileMetadataResponse> responsePage = filePage.map((fileShare) -> filesMapper.mapToResponse(fileShare.getFile()));
        return ResponseEntity.ok(responsePage);
    }

    @GetMapping("/shared-with-me/context")
    public ResponseEntity<Page<FileMetadataResponse>> getShareWithMePageByContext(
            @NotNull(message = "Token cannot be null")
            @NotEmpty(message = "Token cannot be empty")
            @RequestHeader("Authorization") String token,
            @RequestParam(value = "context") String context,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Page<FileShare> filePage = fileSharingService.getSharedFilesByContext(token, context, PageRequest.of(page, size));
        Page<FileMetadataResponse> responsePage = filePage.map((fileShare) -> filesMapper.mapToResponse(fileShare.getFile()));
        return ResponseEntity.ok(responsePage);
    }

    @PostMapping("/share")
    public ResponseEntity<?> shareFile(
            @NotNull(message = "Token cannot be null")
            @NotEmpty(message = "Token cannot be empty")
            @RequestHeader("Authorization") String token,
            @RequestBody ShareFileRequest request
    ) {
        fileSharingService.share(request, token);
        return ResponseEntity.ok("Successfully shared file/s");
    }
}
