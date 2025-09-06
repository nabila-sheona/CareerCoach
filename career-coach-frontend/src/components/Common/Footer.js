import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
} from "@mui/material";
import {
  LinkedIn,
  Facebook,
  Twitter,
  YouTube,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  color: "white",
  padding: theme.spacing(8, 0),
  marginTop: "auto",
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.grey[400],
  textDecoration: "none",
  transition: "color 0.3s ease",
  display: "block",
  marginBottom: theme.spacing(1),
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[400],
  border: `1px solid ${theme.palette.grey[700]}`,
  marginRight: theme.spacing(1),
  "&:hover": {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    backgroundColor: "transparent",
  },
}));

const Footer = () => {
  return (
    <FooterContainer component="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="bold"
              color="primary"
            >
              CareerCoach
            </Typography>
            <Typography
              variant="body2"
              color="grey.400"
              sx={{ mb: 3, lineHeight: 1.6 }}
            >
              Empowering Bangladesh's youth with AI-powered career preparation
              tools. Bridging the gap between education and employment.
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
              <SocialIcon size="small">
                <Facebook fontSize="small" />
              </SocialIcon>
              <SocialIcon size="small">
                <LinkedIn fontSize="small" />
              </SocialIcon>
              <SocialIcon size="small">
                <Twitter fontSize="small" />
              </SocialIcon>
              <SocialIcon size="small">
                <YouTube fontSize="small" />
              </SocialIcon>
            </Box>

            {/* Contact Info */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Email sx={{ fontSize: 18, color: "grey.400", mr: 1 }} />
              <FooterLink
                href="mailto:support@careercoachbd.com"
                variant="body2"
              >
                support@careercoachbd.com
              </FooterLink>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Phone sx={{ fontSize: 18, color: "grey.400", mr: 1 }} />
              <FooterLink href="tel:+8801700000000" variant="body2">
                +880 1700-000000
              </FooterLink>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
              <LocationOn
                sx={{ fontSize: 18, color: "grey.400", mr: 1, mt: 0.5 }}
              />
              <FooterLink href="#" variant="body2">
                Dhaka, Bangladesh
              </FooterLink>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Features
            </Typography>
            <FooterLink href="#" variant="body2">
              CV Review
            </FooterLink>
            <FooterLink href="#" variant="body2">
              Aptitude Tests
            </FooterLink>
            <FooterLink href="#" variant="body2">
              Mock Interviews
            </FooterLink>
            <FooterLink href="#" variant="body2">
              Progress Tracking
            </FooterLink>
            <FooterLink href="#" variant="body2">
              Skill Analysis
            </FooterLink>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Support
            </Typography>
            <FooterLink href="#" variant="body2">
              Help Center
            </FooterLink>
            <FooterLink href="#" variant="body2">
              Contact Us
            </FooterLink>
            <FooterLink href="#" variant="body2">
              FAQ
            </FooterLink>
            <FooterLink href="#" variant="body2">
              Community
            </FooterLink>
            <FooterLink href="#" variant="body2">
              Feedback
            </FooterLink>
          </Grid>

          {/* Company */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Company
            </Typography>
            <FooterLink href="#" variant="body2">
              About Us
            </FooterLink>
            <FooterLink href="#" variant="body2">
              Careers
            </FooterLink>
            <FooterLink href="#" variant="body2">
              Blog
            </FooterLink>
            <FooterLink href="#" variant="body2">
              Press
            </FooterLink>
            <FooterLink href="#" variant="body2">
              Partners
            </FooterLink>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Legal
            </Typography>
            <FooterLink href="#" variant="body2">
              Privacy Policy
            </FooterLink>
            <FooterLink href="#" variant="body2">
              Terms of Service
            </FooterLink>
            <FooterLink href="#" variant="body2">
              Cookie Policy
            </FooterLink>
            <FooterLink href="#" variant="body2">
              Data Protection
            </FooterLink>
            <FooterLink href="#" variant="body2">
              Security
            </FooterLink>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: "grey.700" }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="grey.400" textAlign="center">
            © 2024 CareerCoach. All rights reserved. Made with ❤️ for
            Bangladesh's future.
          </Typography>

          <Box sx={{ display: "flex", gap: 3 }}>
            <FooterLink
              href="#"
              variant="body2"
              sx={{ mb: 0, fontSize: "0.875rem" }}
            >
              Privacy Policy
            </FooterLink>
            <FooterLink
              href="#"
              variant="body2"
              sx={{ mb: 0, fontSize: "0.875rem" }}
            >
              Terms of Service
            </FooterLink>
            <FooterLink
              href="#"
              variant="body2"
              sx={{ mb: 0, fontSize: "0.875rem" }}
            >
              Sitemap
            </FooterLink>
          </Box>
        </Box>

        {/* Badges */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            mt: 3,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              padding: 1,
              backgroundColor: "grey.800",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 12,
                height: 12,
                backgroundColor: "#4CAF50",
                borderRadius: "50%",
                animation: "pulse 2s infinite",
              }}
            />
            <Typography variant="caption" color="grey.400">
              Secure & Encrypted
            </Typography>
          </Box>

          <Box
            sx={{
              padding: 1,
              backgroundColor: "grey.800",
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" color="grey.400">
              🚀 Powered by AI Technology
            </Typography>
          </Box>
        </Box>
      </Container>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </FooterContainer>
  );
};

export default Footer;
