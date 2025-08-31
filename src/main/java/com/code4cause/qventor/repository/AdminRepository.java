package com.code4cause.qventor.repository;

import com.code4cause.qventor.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin,Long> {
    Optional<Admin> findBySupabaseUserId(String supabaseUserId);
}
