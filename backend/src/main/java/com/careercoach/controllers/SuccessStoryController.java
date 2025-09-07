package com.careercoach.controllers;

import com.careercoach.models.SuccessStory;
import com.careercoach.service.SuccessStoryService;
import com.careercoach.utility.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/success-stories")
public class SuccessStoryController {

    @Autowired
    private SuccessStoryService successStoryService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    private String extractEmailFromToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token format");
        }
        String jwtToken = token.replace("Bearer ", "");
        return jwtTokenUtil.getUsernameFromToken(jwtToken);
    }

    @PostMapping
    public ResponseEntity<?> createStory(@RequestBody SuccessStory story, 
                                       @RequestHeader("Authorization") String token) {
        try {
            String userEmail = extractEmailFromToken(token);
            
            // Validate input
            if (story.getTitle() == null || story.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Title is required"
                ));
            }
            
            if (story.getContent() == null || story.getContent().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Content is required"
                ));
            }
            
            SuccessStory createdStory = successStoryService.createStory(story, userEmail);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Story created successfully",
                "story", createdStory
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to create story: " + e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllStories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "recent") String sort) {
        try {
            Page<SuccessStory> stories;
            
            if (search != null && !search.trim().isEmpty()) {
                stories = successStoryService.searchStories(search, page, size);
            } else if (category != null && !category.trim().isEmpty()) {
                stories = successStoryService.getStoriesByCategory(category, page, size);
            } else if ("popular".equals(sort)) {
                stories = successStoryService.getPopularStories(page, size);
            } else {
                stories = successStoryService.getAllStories(page, size);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stories", stories.getContent());
            response.put("currentPage", stories.getNumber());
            response.put("totalPages", stories.getTotalPages());
            response.put("totalElements", stories.getTotalElements());
            response.put("hasNext", stories.hasNext());
            response.put("hasPrevious", stories.hasPrevious());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to fetch stories: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStoryById(@PathVariable String id) {
        try {
            Optional<SuccessStory> story = successStoryService.getStoryById(id);
            
            if (story.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", "Story not found"
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "story", story.get()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to fetch story: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/my-stories")
    public ResponseEntity<?> getMyStories(@RequestHeader("Authorization") String token) {
        try {
            String userEmail = extractEmailFromToken(token);
            List<SuccessStory> stories = successStoryService.getStoriesByUser(userEmail);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "stories", stories
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to fetch your stories: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStory(@PathVariable String id,
                                       @RequestBody SuccessStory story,
                                       @RequestHeader("Authorization") String token) {
        try {
            String userEmail = extractEmailFromToken(token);
            
            SuccessStory updatedStory = successStoryService.updateStory(id, story, userEmail);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Story updated successfully",
                "story", updatedStory
            ));
            
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
                ));
            } else if (e.getMessage().contains("Unauthorized")) {
                return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
                ));
            }
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to update story: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStory(@PathVariable String id,
                                       @RequestHeader("Authorization") String token) {
        try {
            String userEmail = extractEmailFromToken(token);
            
            successStoryService.deleteStory(id, userEmail);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Story deleted successfully"
            ));
            
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
                ));
            } else if (e.getMessage().contains("Unauthorized")) {
                return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
                ));
            }
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to delete story: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable String id,
                                      @RequestHeader("Authorization") String token) {
        try {
            String userEmail = extractEmailFromToken(token);
            
            SuccessStory story = successStoryService.toggleLike(id, userEmail);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Like toggled successfully",
                "story", story
            ));
            
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
                ));
            }
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to toggle like: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable String id,
                                      @RequestBody Map<String, String> request,
                                      @RequestHeader("Authorization") String token) {
        try {
            String userEmail = extractEmailFromToken(token);
            String content = request.get("content");
            
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Comment content is required"
                ));
            }
            
            SuccessStory story = successStoryService.addComment(id, content, userEmail);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Comment added successfully",
                "story", story
            ));
            
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
                ));
            }
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to add comment: " + e.getMessage()
            ));
        }
    }
}