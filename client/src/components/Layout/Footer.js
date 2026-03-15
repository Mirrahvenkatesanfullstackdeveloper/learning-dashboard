import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Learning Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Empowering learners worldwide with quality education and innovative learning tools.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="primary" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="primary" aria-label="YouTube">
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Platform
            </Typography>
            <Link component={RouterLink} to="/courses" color="text.secondary" display="block" sx={{ mb: 1, textDecoration: 'none' }}>
              Courses
            </Link>
            <Link component={RouterLink} to="/assignments" color="text.secondary" display="block" sx={{ mb: 1, textDecoration: 'none' }}>
              Assignments
            </Link>
            <Link component={RouterLink} to="/study-plans" color="text.secondary" display="block" sx={{ mb: 1, textDecoration: 'none' }}>
              Study Plans
            </Link>
            <Link component={RouterLink} to="/payments" color="text.secondary" display="block" sx={{ mb: 1, textDecoration: 'none' }}>
              Payments
            </Link>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Support
            </Typography>
            <Link component={RouterLink} to="/help" color="text.secondary" display="block" sx={{ mb: 1, textDecoration: 'none' }}>
              Help Center
            </Link>
            <Link component={RouterLink} to="/faq" color="text.secondary" display="block" sx={{ mb: 1, textDecoration: 'none' }}>
              FAQ
            </Link>
            <Link component={RouterLink} to="/contact" color="text.secondary" display="block" sx={{ mb: 1, textDecoration: 'none' }}>
              Contact Us
            </Link>
            <Link component={RouterLink} to="/tutorials" color="text.secondary" display="block" sx={{ mb: 1, textDecoration: 'none' }}>
              Tutorials
            </Link>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Subscribe to our newsletter
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Get the latest updates on new courses and features.
            </Typography>
            <Box component="form" sx={{ display: 'flex', gap: 1 }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  outline: 'none',
                }}
              />
              <button
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Subscribe
              </button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Learning Dashboard. All rights reserved.
          </Typography>
          <Box>
            <Link href="#" color="text.secondary" sx={{ mr: 2, textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Link href="#" color="text.secondary" sx={{ mr: 2, textDecoration: 'none' }}>
              Terms of Service
            </Link>
            <Link href="#" color="text.secondary" sx={{ textDecoration: 'none' }}>
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;