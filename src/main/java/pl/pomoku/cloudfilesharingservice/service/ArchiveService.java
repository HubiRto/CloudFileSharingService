package pl.pomoku.cloudfilesharingservice.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import org.apache.commons.compress.archivers.tar.TarArchiveOutputStream;
import org.apache.commons.compress.compressors.gzip.GzipCompressorInputStream;
import org.apache.commons.compress.compressors.gzip.GzipCompressorOutputStream;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pl.pomoku.cloudfilesharingservice.dto.request.CreateArchiveRequest;
import pl.pomoku.cloudfilesharingservice.entity.FileMetadata;
import pl.pomoku.cloudfilesharingservice.entity.User;
import pl.pomoku.cloudfilesharingservice.exception.AppException;
import pl.pomoku.cloudfilesharingservice.exception.files.FileDataNotFoundException;
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
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
@RequiredArgsConstructor
public class ArchiveService {
    public static final String FILE_DIRECTORY = System.getProperty("user.home") + "/data";
    private static final String COMPRESS_DIRECTORY = FILE_DIRECTORY + "/compression";
    private final FileMetadataRepository fileMetadataRepository;
    private final UserService userService;

    @Transactional
    public FileMetadata createCompressedArchive(CreateArchiveRequest request, String token) {
        User user = userService.getUserFromToken(token);
        String filename = "%s.%s".formatted(request.getName(), request.getType().toLowerCase());

        if (fileMetadataRepository.existsByNameAndPathAndCreatedBy(filename, request.getPath(), user)) {
            throw new AppException("Archive with this name already exists", HttpStatus.CONFLICT);
        }

        FileMetadata parent = findParentDirectory(request.getPath(), user);
        Path tempDir = createTempDirectory();

        try {
            copyFilesToTempDirectory(request, tempDir);

            Path uploadPath = createUploadPath();

            String fileExtension = getFileExtension(filename);
            String uuidFileName = UUID.randomUUID() + fileExtension;
            Path filePath = uploadPath.resolve(uuidFileName);

            createArchive(tempDir, filePath, request.getType());

            FileMetadata archiveMetadata = createArchiveMetadata(
                    filename,
                    request,
                    uploadPath,
                    uuidFileName,
                    user,
                    filePath,
                    parent
            );

            if (parent != null) {
                updateParentSize(parent, archiveMetadata);
            }

            return fileMetadataRepository.save(archiveMetadata);
        } catch (Exception e) {
            throw new AppException("Failed to create compressed archive", HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            deleteTempDirectory(tempDir);
        }
    }

    private FileMetadata findParentDirectory(String path, User user) {
        if (!path.equals("/")) {
            int secondToLastSeparatorIndex = path.lastIndexOf('/', path.lastIndexOf("/") - 1);
            String normalizePath = path.substring(0, secondToLastSeparatorIndex + 1);
            String name = path.substring(secondToLastSeparatorIndex + 1, path.length() - 1);

            return fileMetadataRepository.findByPathAndNameAndCreatedBy(normalizePath, name, user)
                    .orElseThrow(() -> new AppException("Parent folder with this path does not exist", HttpStatus.NOT_FOUND));
        }
        return null;
    }

    private Path createTempDirectory() {
        try {
            return Files.createDirectories(Paths.get(COMPRESS_DIRECTORY, UUID.randomUUID().toString()));
        } catch (IOException e) {
            throw new AppException("Failed to create compress directory", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void copyFilesToTempDirectory(CreateArchiveRequest request, Path tempDir) {
        for (Long id : request.getIds()) {
            FileMetadata fileMetadata = fileMetadataRepository.findById(id)
                    .orElseThrow(() -> new FileDataNotFoundException(id));
            copyFileOrDirectory(fileMetadata, tempDir);
        }
    }

    private Path createUploadPath() {
        try {
            LocalDate today = LocalDate.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
            String datePath = today.format(formatter);

            Path uploadPath = Paths.get(FILE_DIRECTORY, datePath).toAbsolutePath().normalize();

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            return uploadPath;
        } catch (IOException e) {
            throw new AppException("Failed to create upload directory", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String getFileExtension(String filename) {
        return filename.contains(".") ? filename.substring(filename.lastIndexOf(".")) : "";
    }

    private void createArchive(Path sourceDir, Path archivePath, String archiveType) {
        try {
            switch (archiveType) {
                case "zip":
                    createZipArchive(sourceDir, archivePath);
                    break;
                case "tar":
                    createTarArchive(sourceDir, archivePath);
                    break;
                default:
                    throw new AppException("Unsupported archive type: " + archiveType, HttpStatus.BAD_REQUEST);
            }
        } catch (IOException e) {
            throw new AppException("Failed to create archive", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void createZipArchive(Path sourceDir, Path archivePath) throws IOException {
        try (ZipOutputStream zs = new ZipOutputStream(Files.newOutputStream(archivePath))) {
            Files.walk(sourceDir).filter(path -> !Files.isDirectory(path)).forEach(path -> {
                ZipEntry zipEntry = new ZipEntry(sourceDir.relativize(path).toString());
                try {
                    zs.putNextEntry(zipEntry);
                    Files.copy(path, zs);
                    zs.closeEntry();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            });
        }
    }

    private void createTarArchive(Path sourceDir, Path archivePath) throws IOException {
        try (TarArchiveOutputStream tos = new TarArchiveOutputStream(
                new GzipCompressorOutputStream(Files.newOutputStream(archivePath)))) {
            Files.walk(sourceDir).filter(path -> !Files.isDirectory(path)).forEach(path -> {
                TarArchiveEntry tarEntry = new TarArchiveEntry(path.toFile(), sourceDir.relativize(path).toString());
                try {
                    tos.putArchiveEntry(tarEntry);
                    Files.copy(path, tos);
                    tos.closeArchiveEntry();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            });
            tos.finish();
        }
    }

    private void deleteTempDirectory(Path tempDir) {
        try {
            FileUtils.deleteDirectory(tempDir.toFile());
        } catch (IOException e) {
            throw new AppException("Failed to delete compress directory", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private FileMetadata createArchiveMetadata(
            String filename,
            CreateArchiveRequest request,
            Path uploadPath,
            String uuidFileName,
            User user,
            Path filePath,
            FileMetadata parent
    ) {
        try {
            FileMetadata archiveMetadata = new FileMetadata();
            archiveMetadata.setName(filename);
            archiveMetadata.setPath(request.getPath());
            archiveMetadata.setFilePath(uploadPath + "/" + uuidFileName);
            archiveMetadata.setMime(Files.probeContentType(filePath));
            archiveMetadata.setSize(Files.size(filePath));
            archiveMetadata.setCreatedBy(user);
            archiveMetadata.setCreatedAt(LocalDateTime.now());
            archiveMetadata.setLastModifiedAt(null);
            archiveMetadata.setParent(parent);
            archiveMetadata.setFolder(false);
            return archiveMetadata;
        } catch (IOException e) {
            throw new AppException("Failed to create archive metadata", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void updateParentSize(FileMetadata parent, FileMetadata archiveMetadata) {
        parent.setSize(parent.getSize() + archiveMetadata.getSize());
        fileMetadataRepository.save(parent);
    }

    private void copyFileOrDirectory(FileMetadata metadata, Path parentPath) {
        try {
            if (metadata.isFolder()) {
                Path targetDir = parentPath.resolve(metadata.getName());
                Files.createDirectories(targetDir);
                if (metadata.getCreatedBy() != null) {
                    for (FileMetadata child : metadata.getChildren()) {
                        copyFileOrDirectory(child, targetDir);
                    }
                }
            } else {
                Path targetFile = parentPath.resolve(metadata.getName());
                Files.copy(Paths.get(metadata.getFilePath()), targetFile, REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new AppException("Failed to copy file or create directory in compress folder", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public List<FileMetadata> decompressArchive(Long archiveId, String targetPath, String token) {
        User user = userService.getUserFromToken(token);
        FileMetadata archiveMetadata = fileMetadataRepository.findById(archiveId)
                .orElseThrow(() -> new FileDataNotFoundException(archiveId));

        FileMetadata parent = findParentDirectory(targetPath, user);

        Path archivePath = Paths.get(archiveMetadata.getFilePath());
        Path tempDir = createTempDirectory();

        List<FileMetadata> decompressedFiles = new ArrayList<>();

        try {
            switch (getFileExtension(archiveMetadata.getName())) {
                case ".zip":
                    decompressZipArchive(archivePath, tempDir, decompressedFiles, user, targetPath);
                    break;
                case ".tar.gz":
                    decompressTarArchive(archivePath, tempDir, decompressedFiles, user, targetPath);
                    break;
                default:
                    throw new IllegalArgumentException("Unsupported archive type: " + getFileExtension(archiveMetadata.getName()));
            }

            checkForFilenameConflicts(tempDir, targetPath, user);

            moveFilesToTarget(tempDir, targetPath, decompressedFiles, user);

            return decompressedFiles;
        } catch (IOException e) {
            throw new AppException("Failed to decompress archive", HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            deleteTempDirectory(tempDir);
        }
    }

    private void decompressZipArchive(Path archivePath, Path tempDir, List<FileMetadata> decompressedFiles, User user, String targetPath) throws IOException {
        try (ZipInputStream zis = new ZipInputStream(Files.newInputStream(archivePath))) {
            ZipEntry zipEntry = zis.getNextEntry();
            while (zipEntry != null) {
                Path newPath = tempDir.resolve(zipEntry.getName());
                if (zipEntry.isDirectory()) {
                    Files.createDirectories(newPath);
                } else {
                    Files.createDirectories(newPath.getParent());
                    Files.copy(zis, newPath, REPLACE_EXISTING);
                    decompressedFiles.add(createFileMetadata(newPath, user, targetPath));
                }
                zipEntry = zis.getNextEntry();
            }
        }
    }

    private void decompressTarArchive(Path archivePath, Path tempDir, List<FileMetadata> decompressedFiles, User user, String targetPath) throws IOException {
        try (TarArchiveInputStream tais = new TarArchiveInputStream(
                new GzipCompressorInputStream(Files.newInputStream(archivePath)))) {
            TarArchiveEntry tarEntry = tais.getNextTarEntry();
            while (tarEntry != null) {
                Path newPath = tempDir.resolve(tarEntry.getName());
                if (tarEntry.isDirectory()) {
                    Files.createDirectories(newPath);
                } else {
                    Files.createDirectories(newPath.getParent());
                    Files.copy(tais, newPath, REPLACE_EXISTING);
                    decompressedFiles.add(createFileMetadata(newPath, user, targetPath));
                }
                tarEntry = tais.getNextTarEntry();
            }
        }
    }

    private FileMetadata createFileMetadata(Path path, User user, String targetPath) {
        FileMetadata fileMetadata = new FileMetadata();
        fileMetadata.setName(path.getFileName().toString());
        fileMetadata.setPath(targetPath);
        fileMetadata.setFilePath(path.toString());
        try {
            fileMetadata.setMime(Files.probeContentType(path));
            fileMetadata.setSize(Files.size(path));
        } catch (IOException e) {
            throw new AppException("Failed to create file metadata", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        fileMetadata.setCreatedBy(user);
        fileMetadata.setCreatedAt(LocalDateTime.now());
        fileMetadata.setLastModifiedAt(null);
        fileMetadata.setFolder(Files.isDirectory(path));
        return fileMetadataRepository.save(fileMetadata);
    }

    private void checkForFilenameConflicts(Path tempDir, String targetPath, User user) {
        try (Stream<Path> paths = Files.walk(tempDir)) {
            paths.filter(path -> !Files.isDirectory(path)).forEach(path -> {
                String filename = path.getFileName().toString();
                if (fileMetadataRepository.existsByNameAndPathAndCreatedBy(filename, targetPath, user)) {
                    throw new AppException("File conflict: " + filename, HttpStatus.CONFLICT);
                }
            });
        } catch (IOException e) {
            throw new AppException("Failed to check for filename conflicts", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void moveFilesToTarget(Path tempDir, String targetPath, List<FileMetadata> decompressedFiles, User user) throws IOException {
        try (Stream<Path> paths = Files.walk(tempDir)) {
            paths.filter(path -> !Files.isDirectory(path)).forEach(path -> {
                try {
                    Path targetFile = Paths.get(targetPath).resolve(tempDir.relativize(path).toString());
                    Files.createDirectories(targetFile.getParent());
                    Files.move(path, targetFile, REPLACE_EXISTING);
                    FileMetadata fileMetadata = createFileMetadata(targetFile, user, targetPath);
                    decompressedFiles.add(fileMetadata);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            });
        }
    }
}
