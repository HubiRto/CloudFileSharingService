package pl.pomoku.cloudfilesharingservice.repositry;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.pomoku.cloudfilesharingservice.entity.FileMetadata;
import pl.pomoku.cloudfilesharingservice.entity.User;

import java.util.Optional;

@Repository
public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
    @Query("SELECT f FROM FileMetadata f WHERE f.path = :path AND f.createdBy = :createdBy ORDER BY f.isFolder DESC, f.name ASC")
    Page<FileMetadata> findAllByPathAndCreatedBy(String path, User createdBy, Pageable pageable);

    @Query("SELECT f FROM FileMetadata f WHERE f.name LIKE %:context% AND f.createdBy = :createdBy ORDER BY f.isFolder DESC, f.name ASC")
    Page<FileMetadata> findAllByNameContainingAndCreatedBy(String context, User createdBy, Pageable pageable);

    Optional<FileMetadata> findByPathAndNameAndCreatedBy(String path, String name, User createdBy);
    boolean existsByNameAndPathAndCreatedBy(String name, String path, User createdBy);
}
