package com.code4cause.qventor.repository;

import com.code4cause.qventor.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item,Long> {
    // Custom query method: find items containing a search keyword (case-insensitive)
    List<Item> findByNameContainingIgnoreCase(String itemName);
    Item findByName(String itemName);
}
