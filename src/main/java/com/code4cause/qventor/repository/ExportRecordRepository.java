package com.code4cause.qventor.repository;

import com.code4cause.qventor.model.ExportRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExportRecordRepository extends JpaRepository<ExportRecord,Long> {
    List<ExportRecord> findByItemId(Long itemId);
}
