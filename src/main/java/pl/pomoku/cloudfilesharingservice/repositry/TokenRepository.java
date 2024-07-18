package pl.pomoku.cloudfilesharingservice.repositry;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.pomoku.cloudfilesharingservice.entity.Token;

import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    @Query("SELECT t FROM Token t INNER JOIN User u ON t.user.id = u.id WHERE u.id = :id AND (t.expired = FALSE OR t.revoked = FALSE)")
    List<Token> findAllValidTokenByUser(Long id);

    @Query("SELECT t FROM Token t WHERE t.token = :token")
    Optional<Token> findByToken(@Param("token") String token);
}
