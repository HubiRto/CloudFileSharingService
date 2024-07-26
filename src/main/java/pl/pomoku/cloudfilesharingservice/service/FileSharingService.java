package pl.pomoku.cloudfilesharingservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pl.pomoku.cloudfilesharingservice.dto.request.ShareFileRequest;
import pl.pomoku.cloudfilesharingservice.entity.FileMetadata;
import pl.pomoku.cloudfilesharingservice.entity.FileShare;
import pl.pomoku.cloudfilesharingservice.entity.User;
import pl.pomoku.cloudfilesharingservice.exception.AppException;
import pl.pomoku.cloudfilesharingservice.exception.files.FileDataNotFoundException;
import pl.pomoku.cloudfilesharingservice.repositry.FileMetadataRepository;
import pl.pomoku.cloudfilesharingservice.repositry.FileShareRepository;

import java.util.*;

@Service
@RequiredArgsConstructor
public class FileSharingService {
    private final FileShareRepository fileShareRepository;
    private final FileMetadataRepository fileMetadataRepository;
    private final UserService userService;

    public Page<FileShare> getSharedFilesByPath(String token, String path, Pageable pageable) {
        User user = userService.getUserFromToken(token);
        return fileShareRepository.findAllByUserAndSharedPath(user, path, pageable);
    }

    public Page<FileShare> getSharedFilesByContext(String token, String context, Pageable pageable) {
        User user = userService.getUserFromToken(token);
        return fileShareRepository.findAllByUserAndFile_NameContainingIgnoreCase(user, context, pageable);
    }

    public void share(ShareFileRequest request, String token) {
        User targetuser = userService.getUserFromEmail(request.getEmail());
        User owner = userService.getUserFromToken(token);

        if(owner == targetuser) {
            throw new AppException("You can't share files yourself", HttpStatus.CONFLICT,
                    new AbstractMap.SimpleEntry<>("errorType", "Share Yourself"));
        }

        FileMetadata file = fileMetadataRepository.findById(request.getId())
                .orElseThrow(() -> new FileDataNotFoundException(request.getId()));

        if (file.getCreatedBy() != owner) {
            throw new AppException("You don't have permission to this file", HttpStatus.FORBIDDEN);
        }

        if (fileShareRepository.existsByUserAndFile(targetuser, file)) {
            throw new AppException("File already share", HttpStatus.CONFLICT,
                    new AbstractMap.SimpleEntry<>("errorType", "Exist"));
        }

        createShares(file, "/", targetuser);
    }

    private void createShares(FileMetadata currentFile, String path, User targetUser) {
        if (currentFile.isFolder() && currentFile.getChildren() != null) {
            fileShareRepository.save(createFileShare(currentFile, path, targetUser));
            for (FileMetadata child : currentFile.getChildren()) {
                createShares(child, path + currentFile.getName() + "/", targetUser);
            }
        } else {
            fileShareRepository.save(createFileShare(currentFile, path, targetUser));
        }
    }

    private FileShare createFileShare(FileMetadata file, String path, User targetUser) {
        return FileShare.builder()
                .sharedPath(path)
                .file(file)
                .user(targetUser)
                .build();
    }
}
