import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Fab,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Snackbar
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Add as AddIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useAuth } from "./context/AuthContext";
import { isAuthenticated, logout } from '../utils/auth';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[8],
  },
}));

const StoryImage = styled(CardMedia)(({ theme }) => ({
  height: 200,
  objectFit: "cover",
}));

const UploadArea = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(3),
  textAlign: "center",
  cursor: "pointer",
  transition: "border-color 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.dark,
    backgroundColor: theme.palette.action.hover,
  },
}));

const SuccessStoriesPage = () => {
  const { userState } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newStory, setNewStory] = useState({
    title: "",
    content: "",
    image: null,
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [error, setError] = useState("");
  const [expandedComments, setExpandedComments] = useState({});
  const [newComment, setNewComment] = useState({});

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError("");
      
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (token && isAuthenticated()) {
          headers['Authorization'] = `Bearer ${token}`;
        } else if (token && !isAuthenticated()) {
          // Token exists but is expired, remove it
          logout();
        }
        
        const response = await fetch('http://localhost:8080/api/success-stories', {
          method: 'GET',
          headers: headers
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setStories(data.stories || []);
          } else {
            setError(data.message || 'Failed to fetch stories');
          }
        } else if (response.status === 403 || response.status === 401) {
          // Handle authentication required
          setError('Please login to view success stories. Click here to login.');
          setShowLoginPrompt(true);
        } else {
          setError('Failed to fetch stories');
        }
      } catch (err) {
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleSubmitStory = async () => {
    if (!newStory.title.trim() || !newStory.content.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      if (!token || !isAuthenticated()) {
        setError('Please login to submit a story');
        if (token && !isAuthenticated()) {
          logout();
        }
        return;
      }

      const response = await fetch('http://localhost:8080/api/success-stories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newStory.title,
          content: newStory.content,
          imageUrl: newStory.image,
          fileUrl: newStory.file ? newStory.file.name : null
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Add the new story to the beginning of the list
          setStories(prev => [data.story, ...prev]);
          setNewStory({ title: "", content: "", image: null, file: null });
          setOpenDialog(false);
        } else {
          setError(data.message || 'Failed to submit story');
        }
      } else {
        setError('Failed to submit story. Please try again.');
      }
    } catch (err) {
      setError("Failed to submit story. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeStory = async (storyId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !isAuthenticated()) {
        alert('Please login to like stories');
        if (token && !isAuthenticated()) {
          logout();
        }
        return;
      }

      const response = await fetch(`http://localhost:8080/api/success-stories/${storyId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update the story in the local state
          setStories(prev => prev.map(story => {
            if (story.id === storyId) {
              return {
                ...story,
                likesCount: data.story.likesCount,
                likedByUsers: data.story.likedByUsers
              };
            }
            return story;
          }));
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const toggleComments = (storyId) => {
    setExpandedComments(prev => ({
      ...prev,
      [storyId]: !prev[storyId]
    }));
  };

  const handleAddComment = async (storyId) => {
    const commentText = newComment[storyId];
    if (!commentText?.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token || !isAuthenticated()) {
        alert('Please login to comment on stories');
        if (token && !isAuthenticated()) {
          logout();
        }
        return;
      }

      const response = await fetch(`http://localhost:8080/api/success-stories/${storyId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: commentText })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update the story with new comment data
          setStories(prev => prev.map(story => {
            if (story.id === storyId) {
              return {
                ...story,
                comments: data.story.comments,
                commentsCount: data.story.commentsCount
              };
            }
            return story;
          }));
          setNewComment(prev => ({ ...prev, [storyId]: "" }));
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCommentChange = (storyId, value) => {
    setNewComment(prev => ({ ...prev, [storyId]: value }));
  };

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      if (type === 'image' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setNewStory(prev => ({ ...prev, image: e.target.result }));
        };
        reader.readAsDataURL(file);
      } else if (type === 'file') {
        setNewStory(prev => ({ ...prev, file }));
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading success stories...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Success Stories
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Share your journey and inspire others in the CareerCoach community
        </Typography>
        
        {userState.isLoggedIn && (
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ mb: 2 }}
          >
            Share Your Story
          </Button>
        )}
      </Box>

      {/* Stories Feed */}
      {stories.length === 0 && !loading ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No Success Stories Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Be the first to share your career success story with the CareerCoach community!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Only real user-submitted stories are displayed here. Your story could inspire others on their career journey.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {stories.map((story) => (
          <Grid item xs={12} key={story.id}>
            <StyledCard>
              {story.image && (
                <StoryImage
                  image={story.image}
                  title={story.title}
                />
              )}
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {story.author}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(story.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="h5" component="h2" gutterBottom>
                  {story.title}
                </Typography>
                
                <Typography variant="body1" paragraph>
                  {story.content}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Button
                    startIcon={story.likedByUsers?.includes(localStorage.getItem('userId')) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    onClick={() => handleLikeStory(story.id)}
                    color={story.likedByUsers?.includes(localStorage.getItem('userId')) ? "error" : "inherit"}
                    size="small"
                  >
                    {story.likesCount || 0} Likes
                  </Button>
                  
                  <Button
                    startIcon={<CommentIcon />}
                    onClick={() => toggleComments(story.id)}
                    size="small"
                    color="inherit"
                  >
                    {story.commentsCount || 0} Comments
                  </Button>
                </Box>
                
                {/* Comments Section */}
                {expandedComments[story.id] && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    {/* Existing Comments */}
                     {story.comments && story.comments.length > 0 && (
                       <Box sx={{ mb: 2 }}>
                         {story.comments.map((comment) => (
                           <Box key={comment.id} sx={{ mb: 1.5, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                             <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                               <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mr: 1 }}>
                                 {comment.userName}
                               </Typography>
                               <Typography variant="caption" color="text.secondary">
                                 {new Date(comment.createdAt).toLocaleDateString()}
                               </Typography>
                             </Box>
                             <Typography variant="body2">
                               {comment.content}
                             </Typography>
                           </Box>
                         ))}
                       </Box>
                     )}
                    
                    {/* Add Comment */}
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Write a comment..."
                        value={newComment[story.id] || ''}
                        onChange={(e) => handleCommentChange(story.id, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(story.id);
                          }
                        }}
                        multiline
                        maxRows={3}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleAddComment(story.id)}
                        disabled={!newComment[story.id]?.trim()}
                      >
                        Post
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
          ))}
        </Grid>
      )}

      {/* Add Story Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Share Your Success Story
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          {showLoginPrompt && (
            <Button 
              component={Link} 
              to="/login" 
              variant="contained" 
              size="small" 
              sx={{ ml: 2 }}
            >
              Login
            </Button>
          )}
        </Alert>
      )}
          
          <TextField
            fullWidth
            label="Story Title"
            value={newStory.title}
            onChange={(e) => setNewStory(prev => ({ ...prev, title: e.target.value }))}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Your Story"
            value={newStory.content}
            onChange={(e) => setNewStory(prev => ({ ...prev, content: e.target.value }))}
            margin="normal"
            multiline
            rows={6}
            required
            placeholder="Share your journey, challenges you overcame, and how CareerCoach helped you achieve your goals..."
          />
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Add Image (Optional)
            </Typography>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="image-upload"
              type="file"
              onChange={(e) => handleFileUpload(e, 'image')}
            />
            <label htmlFor="image-upload">
              <UploadArea component="div">
                <UploadIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
                <Typography variant="body1">
                  {newStory.image ? "Image uploaded!" : "Click to upload an image"}
                </Typography>
              </UploadArea>
            </label>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Add Document (Optional)
            </Typography>
            <input
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
              id="file-upload"
              type="file"
              onChange={(e) => handleFileUpload(e, 'file')}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                fullWidth
              >
                {newStory.file ? newStory.file.name : "Upload Document"}
              </Button>
            </label>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitStory}
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? "Sharing..." : "Share Story"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for mobile */}
      {userState.isLoggedIn && (
        <Fab
          color="primary"
          aria-label="add story"
          onClick={() => setOpenDialog(true)}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            display: { xs: "flex", md: "none" },
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
};

export default SuccessStoriesPage;