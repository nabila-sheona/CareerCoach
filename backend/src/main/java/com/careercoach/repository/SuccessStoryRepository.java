package com.careercoach.repository;

import com.careercoach.models.SuccessStory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface SuccessStoryRepository extends MongoRepository<SuccessStory, String> {
    
    // Find stories by author
    List<SuccessStory> findByAuthorIdOrderByCreatedAtDesc(String authorId);
    
    // Find all stories ordered by creation date (newest first)
    Page<SuccessStory> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // Find stories by category
    Page<SuccessStory> findByCategoryOrderByCreatedAtDesc(String category, Pageable pageable);
    
    // Find stories with most likes (popular stories)
    @Query("{}")
    Page<SuccessStory> findAllByOrderByLikesCountDesc(Pageable pageable);
    
    // Search stories by title or content
    @Query("{'$or': [{'title': {'$regex': ?0, '$options': 'i'}}, {'content': {'$regex': ?0, '$options': 'i'}}]}")
    Page<SuccessStory> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String searchTerm, Pageable pageable);
}