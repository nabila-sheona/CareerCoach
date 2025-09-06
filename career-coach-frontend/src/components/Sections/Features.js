import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Description as CVIcon,
  Psychology as AptitudeIcon,
  Mic as InterviewIcon,
  TrendingUp as ProgressIcon,
  Bolt as SkillsIcon,
  School as RoadmapIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";

const FeatureCard = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(4),
  height: "100%",
  background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(
    color,
    0.05
  )} 100%)`,
  borderRadius: theme.spacing(3),
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
  },
  display: "flex",
  flexDirection: "column",
}));

const FeatureIconWrapper = styled(Box)(({ theme, color }) => ({
  width: 60,
  height: 60,
  borderRadius: theme.spacing(2),
  backgroundColor: color,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(3),
  color: "white",
}));

const Features = () => {
  const theme = useTheme();
  const { userState } = useAuth();

  const features = [
    {
      icon: <CVIcon />,
      title: "AI CV Review",
      description:
        "Upload DOC/PDF format. Get feedback tailored to Bangladeshi job formats (S.S.C. → Secondary School Certificate).",
      color: theme.palette.primary.main,
      restricted: true,
      action: "cv-review",
    },
    {
      icon: <AptitudeIcon />,
      title: "Domain-Specific Tests",
      description:
        "Banking (Bangladesh Bank), Tech, Government exams with instant AI-evaluated feedback and explanations.",
      color: theme.palette.secondary.main,
      restricted: true,
      action: "aptitude-tests",
    },
    {
      icon: <InterviewIcon />,
      title: "AI Mock Interviews",
      description:
        "Voice clarity, filler words, eye contact analysis. Get AI-generated ideal answers for improvement.",
      color: "#7c3aed",
      restricted: true,
      action: "mock-interviews",
    },
    {
      icon: <ProgressIcon />,
      title: "Progress Dashboard",
      description:
        'Historical data tracking: "Aptitude Score: 62% → 78% over 3 weeks" with career trajectory predictions.',
      color: "#d97706",
      restricted: true,
      action: "progress-tracking",
    },
    {
      icon: <SkillsIcon />,
      title: "Skill Gap Analyzer",
      description:
        '"For Junior DevOps in BD, Docker and Jenkins are essential. You currently lack experience in both."',
      color: theme.palette.error.main,
      restricted: true,
      action: "skill-gap",
    },
    {
      icon: <RoadmapIcon />,
      title: "Personalized Roadmap",
      description:
        "JS Bangla YouTube tutorials, Coursera BD scholarships, freeCodeCamp BD lessons based on your gaps.",
      color: "#4f46e5",
      restricted: true,
      action: "learning-roadmap",
    },
  ];

  const handleFeatureClick = (feature) => {
    if (feature.restricted && !userState.isLoggedIn) {
      alert(
        "This feature requires registration. Please create an account to access this feature."
      );
      return;
    }

    // In a real app, this would navigate to the specific feature
    alert(`Launching ${feature.title} feature...`);
  };

  return (
    <Box id="features" sx={{ py: 10, bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            fontWeight="bold"
          >
            Comprehensive Career Preparation
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Everything you need to land your dream job in Bangladesh
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <FeatureCard color={feature.color}>
                <FeatureIconWrapper color={feature.color}>
                  {feature.icon}
                </FeatureIconWrapper>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, flexGrow: 1 }}
                >
                  {feature.description}
                </Typography>
                {feature.restricted && (
                  <Chip
                    label="Registered Users Only"
                    size="small"
                    color="error"
                    variant="outlined"
                    sx={{ mb: 2, alignSelf: "flex-start" }}
                  />
                )}
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => handleFeatureClick(feature)}
                  sx={{ fontWeight: "bold", alignSelf: "flex-start" }}
                  endIcon={<UploadIcon />}
                >
                  Try Now
                </Button>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;
