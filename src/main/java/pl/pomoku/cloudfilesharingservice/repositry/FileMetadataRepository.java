package pl.pomoku.cloudfilesharingservice.repositry;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pomoku.cloudfilesharingservice.entity.FileMetadata;
import pl.pomoku.cloudfilesharingservice.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
    List<FileMetadata> findAllByPathAndCreatedBy(String path, User createdBy);
    Optional<FileMetadata> findByPathAndNameAndCreatedBy(String path, String name, User createdBy);
    boolean existsByNameAndParentAndCreatedBy(String name, FileMetadata parent, User createdBy);
    boolean existsByNameAndPathAndCreatedBy(String name, String path, User createdBy);
}
