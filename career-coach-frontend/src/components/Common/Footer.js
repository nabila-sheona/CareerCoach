import React from "react";
import { Box, Container, Grid, Typography, Link, Divider } from "@mui/material";
import { LinkedIn, Facebook, Twitter, YouTube } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: "grey.900", color: "white", py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              CareerCoach
            </Typography>
            <Typography variant="body2" color="grey.400" sx={{ mb: 2 }}>
              Empowering Bangladesh's youth with AI-powered career preparation
              tools.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Link href="#" color="inherit">
                <Facebook />
              </Link>
              <Link href="#" color="inherit">
                <LinkedIn />
              </Link>
              <Link href="#" color="inherit">
                <Twitter />
              </Link>
              <Link href="#" color="inherit">
                <YouTube />
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Features
            </Typography>
            <Link
              href="#"
              color="grey.400"
              variant="body2"
              display="block"
              gutterBottom
            >
              CV Review
            </Link>
            <Link
              href="#"
              color="grey.400"
              variant="body2"
              display="block"
              gutterBottom
            >
              Aptitude Tests
            </Link>
            <Link
              href="#"
              color="grey.400"
              variant="body2"
              display="block"
              gutterBottom
            >
              Mock Interviews
            </Link>
            <Link
              href="#"
              color="grey.400"
              variant="body2"
              display="block"
              gutterBottom
            >
              Progress Tracking
            </Link>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Support
            </Typography>
            <Link
              href="#"
              color="grey.400"
              variant="body2"
              display="block"
              gutterBottom
            >
              Help Center
            </Link>
            <Link
              href="#"
              color="grey.400"
              variant="body2"
              display="block"
              gutterBottom
            >
              Contact Us
            </Link>
            <Link
              href="#"
              color="grey.400"
              variant="body2"
              display="block"
              gutterBottom
            >
              FAQ
            </Link>
            <Link
              href="#"
              color="grey.400"
              variant="body2"
              display="block"
              gutterBottom
            >
              Community
            </Link>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Company
            </Typography>
            <Link
              href="#"
              color="grey.400"
              variant="body2"
              display="block"
              gutterBottom
            >
              About Us
            </Link>
            <Link
              href="#"
              color="grey.400"
              variant="body2"
              display="block"
              gutterBottom
            >
              Careers
            </Link>
            <Link
              href="#"
              color="grey.400"
              variant="body2"
              display="block"
              gutterBottom
            >
              Blog
            </Link>
            <Link
              href="#"
              color="grey.400"
              variant="body2"
              display="block"
              gutterBottom
            >
              Press
            </Link>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Legal
            </Typography>
            <Link
              href="#"
              color="grey.400"
              variant="body2"
              display="block"
              gutterBottom
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              color="grey.400"
              variant="body2"
              display="block"
              gutterBottom
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              color="grey.400"
              variant="body2"
              display="block"
              gutterBottom
            >
              Cookie Policy
            </Link>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: "grey.700" }} />

        <Typography variant="body2" color="grey.400" textAlign="center">
          © 2024 CareerCoach. All rights reserved. Made with ❤️ for Bangladesh's
          future.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
