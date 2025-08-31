package com.code4cause.qventor.repository;

import com.code4cause.qventor.model.ImportRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImportRecordRepository extends JpaRepository<ImportRecord,Long> {
    List<ImportRecord> findByItemId(Long itemId);
}
