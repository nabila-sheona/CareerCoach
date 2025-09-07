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
  padding: theme.spacing(10, 0, 14, 0),
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(8, 0, 10, 0),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(6, 0, 8, 0),
  },
}));

const StatsSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: alpha(theme.palette.grey[50], 0.5),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(6, 0),
  },
}));



const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4, 3),
  textAlign: "center",
  borderRadius: theme.spacing(3),
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  background: "linear-gradient(145deg, #ffffff 0%, #fafafa 100%)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 16px 48px ${alpha(theme.palette.common.black, 0.12)}`,
    "& .stat-icon": {
      transform: "scale(1.1) rotate(5deg)",
    },
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3, 2),
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
  [theme.breakpoints.down("sm")]: {
    width: 60,
    height: 60,
  },
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  justifyContent: "center",
  flexWrap: "wrap",
  marginBottom: theme.spacing(8),
  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(6),
  },
}));

const Home = ({ userState, onGetStartedClick }) => {
  const theme = useTheme();


  const statsData = [
    {
      icon: People,
      value: "3M+",
      label: "Young Job Seekers Annually",
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1),
    },
    {
      icon: TrendingUp,
      value: "70%",
      label: "Lack Job Readiness Skills",
      color: theme.palette.secondary.main,
      bgColor: alpha(theme.palette.secondary.main, 0.1),
    },
    {
      icon: Work,
      value: "1.5M",
      label: "Formal Jobs Created",
      color: theme.palette.error.main,
      bgColor: alpha(theme.palette.error.main, 0.1),
    },
  ];

  return (
    <>
      <HeroSection id="home">
        <Container maxWidth="lg">
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: "text",
                textFillColor: "transparent",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 3,
                fontSize: { xs: "2.5rem", sm: "3rem", md: "3.75rem", lg: "4rem" },
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Comprehensive Career Preparation
            </Typography>
            
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                mb: 4,
                maxWidth: 680,
                mx: "auto",
                lineHeight: 1.6,
                fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.35rem" },
                fontWeight: 400,
                px: { xs: 2, sm: 0 },
              }}
            >
              Everything you need to land your dream job in Bangladesh. 
              Master skills, build confidence, and launch your career with our comprehensive platform.
            </Typography>
          </Box>

          <ButtonGroup>
            <Button
              variant="contained"
              size="large"
              onClick={onGetStartedClick}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: { xs: "1rem", md: "1.1rem" },
                borderRadius: 3,
                minWidth: 180,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                "&:hover": {
                  boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                  transform: "translateY(-2px)",
                },
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
                fontSize: { xs: "1rem", md: "1.1rem" },
                borderRadius: 3,
                minWidth: 180,
                textTransform: "none",
                fontWeight: 600,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              }}
            >
              Watch Demo
            </Button>
          </ButtonGroup>
        </Container>
      </HeroSection>

      {/* Enhanced Stats Section */}
      <StatsSection>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "text.primary",
                mb: 2,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              The Numbers Tell the Story
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
              Understanding Bangladesh's job market challenges and opportunities
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
            {statsData.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <StatCard elevation={0}>
                  <IconWrapper 
                    className="stat-icon"
                    sx={{ backgroundColor: stat.bgColor }}
                  >
                    <stat.icon 
                      sx={{ 
                        fontSize: { xs: 32, md: 40 }, 
                        color: stat.color 
                      }} 
                    />
                  </IconWrapper>
                  
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{
                      color: stat.color,
                      fontWeight: 800,
                      mb: 1,
                      fontSize: { xs: "2.5rem", md: "3rem" },
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "0.95rem", md: "1rem" },
                      fontWeight: 500,
                      lineHeight: 1.4,
                      px: 1,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </StatCard>
              </Grid>
            ))}
          </Grid>

          {/* Additional Context */}
          <Box sx={{ textAlign: "center", mt: 6 }}>
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
              With millions of young professionals entering the job market each year, 
              proper career preparation has never been more crucial for success in Bangladesh's evolving economy.
            </Typography>
          </Box>
        </Container>
      </StatsSection>


    </>
  );
};

export default Home;