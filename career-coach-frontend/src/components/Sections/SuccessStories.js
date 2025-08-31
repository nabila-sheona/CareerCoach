import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StoryCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
  },
}));

const SuccessStories = () => {
  const stories = [
    {
      initials: "AR",
      name: "Arif Rahman",
      role: "Software Engineer at bKash",
      story:
        '"The voice-based emotion analysis during mock interviews helped me identify my nervousness patterns. After 3 weeks of practice, my confidence score improved from 45% to 82%!"',
      rating: 5,
      progress: "Career trajectory: Junior → Team Lead in 3 years",
      color: "primary.main",
    },
    {
      initials: "SF",
      name: "Sadia Fatima",
      role: "Banking Officer at Dutch-Bangla Bank",
      story:
        "\"The Bangladesh Bank exam simulation was spot-on! The AI converted my 'S.S.C.' to proper format and gave me 15 specific improvements for my CV.\"",
      rating: 5,
      progress: "Aptitude: 62% → 89% in 4 weeks",
      color: "secondary.main",
    },
    {
      initials: "MH",
      name: "Mahmud Hasan",
      role: "DevOps Engineer at Grameenphone",
      story:
        '"Skill gap analysis showed I needed Docker & Jenkins. The personalized roadmap with JS Bangla tutorials got me job-ready in 2 months!"',
      rating: 5,
      progress: "Technical skills: 40% → 85%",
      color: "purple.600",
    },
  ];

  return (
    <Box id="success-stories" sx={{ py: 10, bgcolor: "grey.50" }}>
      <Container maxWidth="lg">
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            fontWeight="bold"
          >
            Success Stories
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Real stories from CareerCoach users who landed their dream jobs
          </Typography>
          <Chip
            label="✓ Available to all users"
            color="success"
            variant="outlined"
          />
        </Box>

        <Grid container spacing={4}>
          {stories.map((story, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <StoryCard>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: story.color,
                        width: 48,
                        height: 48,
                        fontWeight: "bold",
                        mr: 2,
                      }}
                    >
                      {story.initials}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {story.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {story.role}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{ mb: 3, fontStyle: "italic" }}
                  >
                    {story.story}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Rating value={story.rating} readOnly size="small" />
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    {story.progress}
                  </Typography>
                </CardContent>
              </StoryCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default SuccessStories;
