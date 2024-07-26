package pl.pomoku.cloudfilesharingservice.repositry;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.pomoku.cloudfilesharingservice.entity.FileMetadata;
import pl.pomoku.cloudfilesharingservice.entity.FileShare;
import pl.pomoku.cloudfilesharingservice.entity.User;

public interface FileShareRepository extends JpaRepository<FileShare, Long> {
    Page<FileShare> findAllByUserAndSharedPath(User user, String sharedPath, Pageable pageable);
    Page<FileShare> findAllByUserAndFile_NameContainingIgnoreCase(User user, String name, Pageable pageable);
    boolean existsByUserAndFile(User user, FileMetadata file);
}
