package com.careercoach.service;

import com.careercoach.models.SuccessStory;
import com.careercoach.models.User;
import com.careercoach.repository.SuccessStoryRepository;
import com.careercoach.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SuccessStoryService {

    @Autowired
    private SuccessStoryRepository successStoryRepository;

    @Autowired
    private UserRepository userRepository;

    public SuccessStory createStory(SuccessStory story, String userEmail) {
        // Find the user by email
        Optional<User> userOptional = userRepository.findByEmail(userEmail);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();
        
        // Set author information
        story.setAuthorId(user.getId());
        story.setAuthorName(user.getName());
        story.setAuthorAvatar(user.getProfilePicture());
        
        // Set timestamps
        LocalDateTime now = LocalDateTime.now();
        story.setCreatedAt(now);
        story.setUpdatedAt(now);
        
        // Initialize counters
        story.setLikesCount(0);
        story.setCommentsCount(0);
        
        return successStoryRepository.save(story);
    }

    public Page<SuccessStory> getAllStories(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return successStoryRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public Page<SuccessStory> getStoriesByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return successStoryRepository.findByCategoryOrderByCreatedAtDesc(category, pageable);
    }

    public Page<SuccessStory> getPopularStories(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return successStoryRepository.findAllByOrderByLikesCountDesc(pageable);
    }

    public List<SuccessStory> getStoriesByUser(String userEmail) {
        Optional<User> userOptional = userRepository.findByEmail(userEmail);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        return successStoryRepository.findByAuthorIdOrderByCreatedAtDesc(userOptional.get().getId());
    }

    public Optional<SuccessStory> getStoryById(String id) {
        return successStoryRepository.findById(id);
    }

    public SuccessStory updateStory(String id, SuccessStory updatedStory, String userEmail) {
        Optional<SuccessStory> existingStoryOptional = successStoryRepository.findById(id);
        if (existingStoryOptional.isEmpty()) {
            throw new RuntimeException("Story not found");
        }

        SuccessStory existingStory = existingStoryOptional.get();
        
        // Verify the user is the author
        Optional<User> userOptional = userRepository.findByEmail(userEmail);
        if (userOptional.isEmpty() || !existingStory.getAuthorId().equals(userOptional.get().getId())) {
            throw new RuntimeException("Unauthorized to update this story");
        }

        // Update fields
        existingStory.setTitle(updatedStory.getTitle());
        existingStory.setContent(updatedStory.getContent());
        existingStory.setCategory(updatedStory.getCategory());
        existingStory.setImageUrl(updatedStory.getImageUrl());
        existingStory.setFileUrl(updatedStory.getFileUrl());
        existingStory.setUpdatedAt(LocalDateTime.now());

        return successStoryRepository.save(existingStory);
    }

    public void deleteStory(String id, String userEmail) {
        Optional<SuccessStory> storyOptional = successStoryRepository.findById(id);
        if (storyOptional.isEmpty()) {
            throw new RuntimeException("Story not found");
        }

        SuccessStory story = storyOptional.get();
        
        // Verify the user is the author
        Optional<User> userOptional = userRepository.findByEmail(userEmail);
        if (userOptional.isEmpty() || !story.getAuthorId().equals(userOptional.get().getId())) {
            throw new RuntimeException("Unauthorized to delete this story");
        }

        successStoryRepository.deleteById(id);
    }

    public SuccessStory toggleLike(String storyId, String userEmail) {
        Optional<SuccessStory> storyOptional = successStoryRepository.findById(storyId);
        if (storyOptional.isEmpty()) {
            throw new RuntimeException("Story not found");
        }

        Optional<User> userOptional = userRepository.findByEmail(userEmail);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        SuccessStory story = storyOptional.get();
        String userId = userOptional.get().getId();

        if (story.getLikedByUsers().contains(userId)) {
            // Unlike
            story.getLikedByUsers().remove(userId);
            story.setLikesCount(story.getLikesCount() - 1);
        } else {
            // Like
            story.getLikedByUsers().add(userId);
            story.setLikesCount(story.getLikesCount() + 1);
        }

        story.setUpdatedAt(LocalDateTime.now());
        return successStoryRepository.save(story);
    }

    public SuccessStory addComment(String storyId, String content, String userEmail) {
        Optional<SuccessStory> storyOptional = successStoryRepository.findById(storyId);
        if (storyOptional.isEmpty()) {
            throw new RuntimeException("Story not found");
        }

        Optional<User> userOptional = userRepository.findByEmail(userEmail);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        SuccessStory story = storyOptional.get();
        User user = userOptional.get();

        SuccessStory.Comment comment = SuccessStory.Comment.builder()
                .id(UUID.randomUUID().toString())
                .userId(user.getId())
                .userName(user.getName())
                .userAvatar(user.getProfilePicture())
                .content(content)
                .createdAt(LocalDateTime.now())
                .build();

        story.getComments().add(comment);
        story.setCommentsCount(story.getCommentsCount() + 1);
        story.setUpdatedAt(LocalDateTime.now());

        return successStoryRepository.save(story);
    }

    public Page<SuccessStory> searchStories(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return successStoryRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(searchTerm, pageable);
    }
}