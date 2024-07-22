package pl.pomoku.cloudfilesharingservice.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import pl.pomoku.cloudfilesharingservice.dto.request.AddFolderRequest;
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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
@RequiredArgsConstructor
public class FileMetadataService {
    public static final String DIRECTORY = System.getProperty("user.home") + "/data";
    private final FileMetadataRepository fileMetadataRepository;
    private final UserService userService;

    public List<FileMetadata> findAllByPathAndToken(String path, String token) {
        return fileMetadataRepository.findAllByPathAndCreatedBy(path, userService.getUserFromToken(token));
    }

    public void addFolder(AddFolderRequest request, String token) {
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

        fileMetadataRepository.save(newFolder);
    }

    @Transactional
    public List<FileMetadata> uploadFiles(List<MultipartFile> files, String path, String token) throws IOException {
        User user = userService.getUserFromToken(token);

        FileMetadata parent = null;
        if (!path.equals("/")) {
            int secondToLastSeparatorIndex = path.lastIndexOf('/', path.lastIndexOf("/") - 1);
            String normalizePath = path.substring(0, secondToLastSeparatorIndex + 1);
            String name = path.substring(secondToLastSeparatorIndex + 1, path.length() - 1);

            parent = fileMetadataRepository.findByPathAndNameAndCreatedBy(normalizePath, name, user)
                    .orElseThrow(() -> new AppException("Parent folder with this path does not exist", HttpStatus.NOT_FOUND));
        }

        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        String datePath = today.format(formatter);

        Path uploadPath = Paths.get(DIRECTORY, datePath).toAbsolutePath().normalize();

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        List<FileMetadata> fileMetadataList = new ArrayList<>();
        long newFilesSize = 0;

        for (MultipartFile file : files) {
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

            newFilesSize += file.getSize();
            fileMetadataList.add(fileMetadataRepository.save(newFile));
        }

        if(parent != null) {
            parent.setSize(parent.getSize() + newFilesSize);
            fileMetadataRepository.save(parent);
        }

        return fileMetadataList;
    }
}
