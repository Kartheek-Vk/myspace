package com.productivity.repository;

import com.productivity.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByGoogleSubjectId(String googleSubjectId);

    Optional<User> findByEmail(String email);

    boolean existsByGoogleSubjectId(String googleSubjectId);

    boolean existsByEmail(String email);
}
