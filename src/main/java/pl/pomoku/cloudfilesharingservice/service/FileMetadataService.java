package pl.pomoku.cloudfilesharingservice.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import pl.pomoku.cloudfilesharingservice.dto.request.AddFolderRequest;
import pl.pomoku.cloudfilesharingservice.dto.request.RenameRequest;
import pl.pomoku.cloudfilesharingservice.entity.FileMetadata;
import pl.pomoku.cloudfilesharingservice.entity.User;
import pl.pomoku.cloudfilesharingservice.exception.AppException;
import pl.pomoku.cloudfilesharingservice.repositry.FileMetadataRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
@RequiredArgsConstructor
public class FileMetadataService {
    public static final String DIRECTORY = System.getProperty("user.home") + "/data";
    private final FileMetadataRepository fileMetadataRepository;
    private final UserService userService;

    public Page<FileMetadata> findAllByPathAndToken(String path, String token, Pageable pageable) {
        return fileMetadataRepository.findAllByPathAndCreatedBy(path, userService.getUserFromToken(token), pageable);
    }

    public Page<FileMetadata> findAllByNameContainingAndToken(String context, String token, Pageable pageable) {
        return fileMetadataRepository.findAllByNameContainingAndCreatedBy(context, userService.getUserFromToken(token), pageable);
    }

    public void deleteFile(Long id, String token) {
        User user = userService.getUserFromToken(token);

        FileMetadata file = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new AppException("File with this id does not exist", HttpStatus.NOT_FOUND));

        if (!file.getCreatedBy().equals(user)) {
            throw new AppException("You don't have permission to this file", HttpStatus.FORBIDDEN);
        }

        FileMetadata parent = file.getParent();
        fileMetadataRepository.delete(file);

        if (parent != null) {
            parent.setSize(parent.getSize() - file.getSize());
            fileMetadataRepository.save(parent);
        }
    }

    @Transactional
    public void deleteFiles(Long[] ids, String token) {
        User user = userService.getUserFromToken(token);

        for(Long id : ids) {
            FileMetadata file = fileMetadataRepository.findById(id)
                    .orElseThrow(() -> new AppException("File with this id does not exist", HttpStatus.NOT_FOUND));

            if (!file.getCreatedBy().equals(user)) {
                throw new AppException("You don't have permission to this file", HttpStatus.FORBIDDEN);
            }

            FileMetadata parent = file.getParent();
            fileMetadataRepository.delete(file);

            if (parent != null) {
                parent.setSize(parent.getSize() - file.getSize());
                fileMetadataRepository.save(parent);
            }
        }
    }

    public FileMetadata renameFile(Long id, RenameRequest request, String token) {
        User user = userService.getUserFromToken(token);

        FileMetadata file = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new AppException("File with this id does not exist", HttpStatus.NOT_FOUND));

        if (!file.getCreatedBy().equals(user)) {
            throw new AppException("You don't have permission to this file", HttpStatus.FORBIDDEN);
        }

        if (fileMetadataRepository.existsByNameAndPathAndCreatedBy(request.getNewName(), file.getPath(), user)) {
            throw new AppException("File or Folder with this name already exists", HttpStatus.CONFLICT);
        }

        int indexOfExtensionDot = file.getName().lastIndexOf(".");
        String extension = file.getName().substring(indexOfExtensionDot);

        file.setName(request.getNewName() + extension);
        file.setLastModifiedAt(LocalDateTime.now());
        return fileMetadataRepository.save(file);
    }

    public FileMetadata addFolder(AddFolderRequest request, String token) {
        User user = userService.getUserFromToken(token);

        FileMetadata parent = null;
        if (!request.getPath().equals("/")) {
            String path = request.getPath();
            int secondToLastSeparatorIndex = path.lastIndexOf('/', path.lastIndexOf("/") - 1);
            String normalizePath = path.substring(0, secondToLastSeparatorIndex + 1);
            String name = path.substring(secondToLastSeparatorIndex + 1, path.length() - 1);

            parent = fileMetadataRepository.findByPathAndNameAndCreatedBy(normalizePath, name, user)
                    .orElseThrow(() -> new AppException("Parent folder with this path does not exist", HttpStatus.NOT_FOUND));
        }

        if (fileMetadataRepository.existsByNameAndPathAndCreatedBy(request.getName(), request.getPath(), user)) {
            throw new AppException("Folder with this name already exists", HttpStatus.CONFLICT);
        }

        FileMetadata newFolder = new FileMetadata();
        newFolder.setName(request.getName());
        newFolder.setFilePath(null);
        newFolder.setPath(request.getPath());
        newFolder.setFolder(true);
        newFolder.setMime("dir");
        newFolder.setSize(0);
        newFolder.setCreatedAt(LocalDateTime.now());
        newFolder.setCreatedBy(user);
        newFolder.setParent(parent);

        return fileMetadataRepository.save(newFolder);
    }

    @Transactional
    public FileMetadata uploadFile(MultipartFile file, String path, String token) throws IOException {
        User user = userService.getUserFromToken(token);

        FileMetadata parent = null;
        if (!path.equals("/")) {
            int secondToLastSeparatorIndex = path.lastIndexOf('/', path.lastIndexOf("/") - 1);
            String normalizePath = path.substring(0, secondToLastSeparatorIndex + 1);
            String name = path.substring(secondToLastSeparatorIndex + 1, path.length() - 1);

            parent = fileMetadataRepository.findByPathAndNameAndCreatedBy(normalizePath, name, user)
                    .orElseThrow(() -> new AppException("Parent folder with this path does not exist", HttpStatus.NOT_FOUND));
        }

        if (file.getOriginalFilename() == null) {
            throw new AppException("Filename is empty", HttpStatus.BAD_REQUEST);
        }

        if (fileMetadataRepository.existsByNameAndPathAndCreatedBy(StringUtils.cleanPath(file.getOriginalFilename()), path, user)) {
            throw new AppException("File with this name already exists", HttpStatus.CONFLICT);
        }

        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        String datePath = today.format(formatter);

        Path uploadPath = Paths.get(DIRECTORY, datePath).toAbsolutePath().normalize();

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }


        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = originalFileName.contains(".") ? originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
        String uuidFileName = UUID.randomUUID() + fileExtension;
        Path filePath = uploadPath.resolve(uuidFileName);

        Files.copy(file.getInputStream(), filePath, REPLACE_EXISTING);

        FileMetadata newFile = new FileMetadata();
        newFile.setName(originalFileName);
        newFile.setPath(path);
        newFile.setFilePath(uploadPath + "/" + uuidFileName);
        newFile.setFolder(false);
        newFile.setMime(file.getContentType());
        newFile.setSize(file.getSize());
        newFile.setCreatedAt(LocalDateTime.now());
        newFile.setCreatedBy(user);
        newFile.setParent(parent);

        if (parent != null) {
            parent.setSize(parent.getSize() + newFile.getSize());
            fileMetadataRepository.save(parent);
        }

        return fileMetadataRepository.save(newFile);
    }

    @Transactional
    public FileMetadata addNewFile(String fileName, String path, String token) throws IOException {
        User user = userService.getUserFromToken(token);

        FileMetadata parent = null;
        if (!path.equals("/")) {
            int secondToLastSeparatorIndex = path.lastIndexOf('/', path.lastIndexOf("/") - 1);
            String normalizePath = path.substring(0, secondToLastSeparatorIndex + 1);
            String name = path.substring(secondToLastSeparatorIndex + 1, path.length() - 1);

            parent = fileMetadataRepository.findByPathAndNameAndCreatedBy(normalizePath, name, user)
                    .orElseThrow(() -> new AppException("Parent folder with this path does not exist", HttpStatus.NOT_FOUND));
        }

        if (fileMetadataRepository.existsByNameAndPathAndCreatedBy(StringUtils.cleanPath(fileName), path, user)) {
            throw new AppException("File with this name already exists", HttpStatus.CONFLICT);
        }

        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        String datePath = today.format(formatter);

        Path uploadPath = Paths.get(DIRECTORY, datePath).toAbsolutePath().normalize();

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFileName = StringUtils.cleanPath(fileName);
        String fileExtension = originalFileName.contains(".") ? originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
        String uuidFileName = UUID.randomUUID() + fileExtension;
        Path filePath = uploadPath.resolve(uuidFileName);

        // Create an empty file in the system
        Files.createFile(filePath);

        FileMetadata newFile = new FileMetadata();
        newFile.setName(originalFileName);
        newFile.setPath(path);
        newFile.setFilePath(uploadPath + "/" + uuidFileName);
        newFile.setFolder(false);
        newFile.setMime(Files.probeContentType(filePath));
        newFile.setSize(0L); // Empty file size
        newFile.setCreatedAt(LocalDateTime.now());
        newFile.setCreatedBy(user);
        newFile.setParent(parent);

        if (parent != null) {
            parent.setSize(parent.getSize() + newFile.getSize());
            fileMetadataRepository.save(parent);
        }

        return fileMetadataRepository.save(newFile);
    }
}
