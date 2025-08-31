import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  alpha,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { TrendingUp, People, Work } from "@mui/icons-material";

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.light,
    0.1
  )} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
  padding: theme.spacing(15, 0),
  textAlign: "center",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(10, 0),
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  borderRadius: theme.spacing(3),
  boxShadow: theme.shadows[4],
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
  },
}));

const Home = ({ userState, onGetStartedClick }) => {
  const theme = useTheme();

  return (
    <>
      <HeroSection id="home">
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 3,
            }}
          >
            Bridge the Gap Between Education & Employment
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: 800,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            AI-powered job readiness platform helping 3 million+ young
            Bangladeshis prepare for their dream careers with personalized
            coaching, mock interviews, and skill assessments.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={onGetStartedClick}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                borderRadius: 3,
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                borderRadius: 3,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              Watch Demo
            </Button>
          </Box>

          {/* Stats Section */}
          <Grid container spacing={4} sx={{ mt: 8 }}>
            <Grid item xs={12} md={4}>
              <StatCard>
                <People sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                <Typography
                  variant="h3"
                  component="div"
                  color="primary"
                  fontWeight="bold"
                  gutterBottom
                >
                  3M+
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Young Job Seekers Annually
                </Typography>
              </StatCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard>
                <TrendingUp
                  sx={{ fontSize: 48, color: "secondary.main", mb: 2 }}
                />
                <Typography
                  variant="h3"
                  component="div"
                  color="secondary"
                  fontWeight="bold"
                  gutterBottom
                >
                  70%
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Lack Job Readiness Skills
                </Typography>
              </StatCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard>
                <Work sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
                <Typography
                  variant="h3"
                  component="div"
                  color="error"
                  fontWeight="bold"
                  gutterBottom
                >
                  1.5M
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Formal Jobs Created
                </Typography>
              </StatCard>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>
    </>
  );
};

export default Home;
