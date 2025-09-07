import React from "react";
import { useNavigate } from "react-router-dom";
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

const FeaturesSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(8, 0),
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: "100%",
  minHeight: 380, // Fixed minimum height for consistency
  borderRadius: theme.spacing(3),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 16px 48px ${alpha(theme.palette.common.black, 0.12)}`,
    "& .feature-icon": {
      transform: "scale(1.1) rotate(5deg)",
    },
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
    minHeight: 350,
  },
}));

const FeatureIconWrapper = styled(Box)(({ theme }) => ({
  width: 70,
  height: 70,
  borderRadius: theme.spacing(2.5),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(3),
  color: "white",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  [theme.breakpoints.down("sm")]: {
    width: 60,
    height: 60,
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  alignSelf: "flex-start",
  fontWeight: 600,
  fontSize: "0.75rem",
  height: 24,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  fontWeight: 600,
  alignSelf: "flex-start",
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1, 2),
  textTransform: "none",
  fontSize: "0.95rem",
  marginTop: "auto",
  "&:hover": {
    transform: "translateX(4px)",
  },
}));

const Features = () => {
  const theme = useTheme();
  const { userState } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <CVIcon sx={{ fontSize: 32 }} />,
      title: "AI CV Review",
      description:
        "Upload DOC/PDF format. Get feedback tailored to Bangladeshi job formats (S.S.C. → Secondary School Certificate).",
      color: theme.palette.primary.main,
      restricted: true,
      action: "cv-review",
    },
    {
      icon: <AptitudeIcon sx={{ fontSize: 32 }} />,
      title: "Domain-Specific Tests",
      description:
        "Banking (Bangladesh Bank), Tech, Government exams with instant AI-evaluated feedback and explanations.",
      color: theme.palette.secondary.main,
      restricted: true,
      action: "aptitude-tests",
    },
    {
      icon: <InterviewIcon sx={{ fontSize: 32 }} />,
      title: "AI Mock Interviews",
      description:
        "Voice clarity, filler words, eye contact analysis. Get AI-generated ideal answers for improvement.",
      color: "#7c3aed",
      restricted: true,
      action: "mock-interviews",
    },
    {
      icon: <ProgressIcon sx={{ fontSize: 32 }} />,
      title: "Progress Dashboard",
      description:
        'Historical data tracking: "Aptitude Score: 62% → 78% over 3 weeks" with career trajectory predictions.',
      color: "#d97706",
      restricted: true,
      action: "progress-tracking",
    },
    {
      icon: <SkillsIcon sx={{ fontSize: 32 }} />,
      title: "Skill Gap Analyzer",
      description:
        '"For Junior DevOps in BD, Docker and Jenkins are essential. You currently lack experience in both."',
      color: theme.palette.error.main,
      restricted: true,
      action: "skill-gap",
    },
    {
      icon: <RoadmapIcon sx={{ fontSize: 32 }} />,
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

    // Navigate to the specific feature page
    switch (feature.action) {
      case "cv-review":
        navigate("/cv-review");
        break;
      case "aptitude-tests":
        navigate("/aptitude-tests");
        break;
      case "mock-interviews":
        navigate("/mock-interviews");
        break;
      case "progress-tracking":
        navigate("/dashboard");
        break;
      case "skill-gap":
        alert("Skill Gap Analyzer coming soon!");
        break;
      case "learning-roadmap":
        alert("Personalized Roadmap coming soon!");
        break;
      default:
        alert(`Launching ${feature.title} feature...`);
    }
  };

  return (
    <FeaturesSection id="features">
      <Container maxWidth="lg">
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            Comprehensive Career Preparation
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ 
              maxWidth: 600, 
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.6,
            }}
          >
            Everything you need to land your dream job in Bangladesh
          </Typography>
        </Box>

        <Grid 
          container 
          spacing={4} 
          justifyContent="center" 
          alignItems="stretch"
          sx={{
            width: '100%',
            margin: 0,
            '& .MuiGrid-item': {
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >
          {features.map((feature, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                width: '100%'
              }}
            >
              <FeatureCard 
                elevation={0}
                sx={{
                  background: `linear-gradient(135deg, ${alpha(feature.color, 0.1)} 0%, ${alpha(feature.color, 0.05)} 100%)`,
                  border: `1px solid ${alpha(feature.color, 0.2)}`,
                  height: '100%',
                  width: '100%',
                  flex: 1
                }}
              >
                <FeatureIconWrapper 
                  className="feature-icon"
                  sx={{
                    backgroundColor: feature.color,
                    boxShadow: `0 8px 24px ${alpha(feature.color, 0.3)}`,
                  }}
                >
                  {feature.icon}
                </FeatureIconWrapper>
                
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "1.25rem", md: "1.4rem" },
                    color: "text.primary",
                    mb: 2,
                  }}
                >
                  {feature.title}
                </Typography>
                
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ 
                    mb: 3, 
                    flexGrow: 1,
                    lineHeight: 1.6,
                    fontSize: { xs: "0.95rem", md: "1rem" },
                  }}
                >
                  {feature.description}
                </Typography>
                
                {feature.restricted && (
                  <StyledChip
                    label="Registered Users Only"
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                )}
                
                <ActionButton
                  variant="text"
                  color="primary"
                  onClick={() => handleFeatureClick(feature)}
                  endIcon={<UploadIcon />}
                  sx={{ 
                    color: feature.color,
                    "&:hover": {
                      backgroundColor: alpha(feature.color, 0.1),
                    }
                  }}
                >
                  Try Now
                </ActionButton>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>

        {/* Additional Info Section */}
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 800,
              mx: "auto",
              fontSize: { xs: "0.95rem", md: "1rem" },
              lineHeight: 1.6,
              fontStyle: "italic",
            }}
          >
            All features are designed specifically for the Bangladeshi job market, 
            ensuring relevance and effectiveness in your career preparation journey.
          </Typography>
        </Box>
      </Container>
    </FeaturesSection>
  );
};

export default Features;