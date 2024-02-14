package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface AcronymsRepository extends JpaRepository<Acronyms, Integer> {
    List<Acronyms> findByCategory(String category);
    List<Acronyms> findByCategoryIgnoreCase(String category);
    List<Acronyms> findByLength(int length);
    List<Acronyms> findByCategoryIgnoreCaseAndLength(String category, int length);
}