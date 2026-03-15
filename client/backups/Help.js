import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,        // Added missing CardMedia
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Alert,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Search as SearchIcon,
  Help as HelpIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  AccountCircle as AccountIcon,
  Security as SecurityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
  MenuBook as MenuBookIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
  Forum as ForumIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Launch as LaunchIcon,
  LiveHelp as LiveHelpIcon,
  Description as DescriptionIcon,
  BugReport as BugIcon,
  Feedback as FeedbackIcon,
  WhatsApp as WhatsAppIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Help = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const categories = [
    {
      title: 'Getting Started',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      description: 'New to the platform? Start here',
      color: '#667EEA',
      articles: 12,
      link: '/help/getting-started',
    },
    {
      title: 'Courses',
      icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
      description: 'Learn about courses, enrollment, and progress',
      color: '#48BB78',
      articles: 8,
      link: '/help/courses',
    },
    {
      title: 'Assignments',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      description: 'Submit assignments and understand grading',
      color: '#F8B042',
      articles: 10,
      link: '/help/assignments',
    },
    {
      title: 'Payments',
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      description: 'Billing, subscriptions, and refunds',
      color: '#F56565',
      articles: 6,
      link: '/help/payments',
    },
    {
      title: 'Account Settings',
      icon: <AccountIcon sx={{ fontSize: 40 }} />,
      description: 'Manage your profile and preferences',
      color: '#9F7AEA',
      articles: 7,
      link: '/help/account',
    },
    {
      title: 'Security',
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      description: 'Keep your account safe',
      color: '#ED64A6',
      articles: 5,
      link: '/help/security',
    },
  ];

  const popularArticles = [
    {
      title: 'How to enroll in a course',
      views: 2345,
      category: 'Courses',
      icon: <SchoolIcon />,
    },
    {
      title: 'Understanding your grades',
      views: 1890,
      category: 'Assignments',
      icon: <AssignmentIcon />,
    },
    {
      title: 'Payment methods accepted',
      views: 1567,
      category: 'Payments',
      icon: <PaymentIcon />,
    },
    {
      title: 'Resetting your password',
      views: 1234,
      category: 'Account',
      icon: <AccountIcon />,
    },
    {
      title: 'Two-factor authentication setup',
      views: 987,
      category: 'Security',
      icon: <SecurityIcon />,
    },
  ];

  const faqHighlights = [
    {
      question: 'How do I reset my password?',
      answer: 'Go to the login page and click "Forgot Password". Follow the instructions sent to your email.',
    },
    {
      question: 'When will I get my certificate?',
      answer: 'Certificates are issued immediately upon course completion and can be downloaded from your dashboard.',
    },
    {
      question: 'Can I get a refund?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all courses.',
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Simulate search
    const results = popularArticles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Help Center
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find answers to your questions and learn how to make the most of our platform
        </Typography>
      </Box>

      {/* Search Bar */}
      <Paper
        component="form"
        onSubmit={handleSearch}
        sx={{
          p: 2,
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <InputAdornment position="start" sx={{ ml: 1 }}>
          <SearchIcon color="action" />
        </InputAdornment>
        <TextField
          fullWidth
          placeholder="Search for help articles, tutorials, FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="standard"
          InputProps={{ disableUnderline: true }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            ml: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          Search
        </Button>
      </Paper>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Search Results
          </Typography>
          <List>
            {searchResults.map((result, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end">
                    <LaunchIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: '#667EEA20', color: '#667EEA' }}>
                    {result.icon}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={result.title}
                  secondary={`${result.category} • ${result.views} views`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Categories Grid */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Browse by Category
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.title}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px -10px rgba(0,0,0,0.3)',
                },
              }}
              onClick={() => navigate(category.link)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: category.color, width: 56, height: 56, mr: 2 }}>
                    {category.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{category.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {category.articles} articles
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" endIcon={<ArrowForwardIcon />}>
                  Browse Articles
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Popular Articles and FAQ */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Popular Articles
            </Typography>
            <List>
              {popularArticles.map((article, index) => (
                <React.Fragment key={index}>
                  <ListItemButton>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: '#667EEA20', color: '#667EEA', width: 32, height: 32 }}>
                        {article.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={article.title}
                      secondary={`${article.views} views • ${article.category}`}
                    />
                  </ListItemButton>
                  {index < popularArticles.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Frequently Asked Questions
            </Typography>
            {faqHighlights.map((faq, index) => (
              <Accordion key={index} sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<HelpIcon />}>
                  <Typography variant="subtitle2">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate('/help/faq')}
            >
              View All FAQs
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Support Channels */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Get in Touch
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <Avatar sx={{ bgcolor: '#667EEA20', color: '#667EEA', width: 64, height: 64, mx: 'auto', mb: 2 }}>
              <ChatIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              Live Chat
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Chat with our support team
            </Typography>
            <Button variant="contained" fullWidth>
              Start Chat
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <Avatar sx={{ bgcolor: '#48BB7820', color: '#48BB78', width: 64, height: 64, mx: 'auto', mb: 2 }}>
              <EmailIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              Email Support
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Get a response within 24h
            </Typography>
            <Button variant="contained" fullWidth onClick={() => navigate('/help/contact')}>
              Send Email
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <Avatar sx={{ bgcolor: '#F8B04220', color: '#F8B042', width: 64, height: 64, mx: 'auto', mb: 2 }}>
              <ForumIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              Community Forum
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Ask the community
            </Typography>
            <Button variant="contained" fullWidth>
              Visit Forum
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <Avatar sx={{ bgcolor: '#F5656520', color: '#F56565', width: 64, height: 64, mx: 'auto', mb: 2 }}>
              <BugIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              Report Bug
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Help us improve
            </Typography>
            <Button variant="contained" fullWidth>
              Submit Report
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Tutorials and Resources */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Video Tutorials & Resources
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ display: 'flex' }}>
              <CardMedia
                component="img"
                sx={{ width: 100, height: 100, objectFit: 'cover' }}
                image="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                alt="Tutorial thumbnail"
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    Getting Started Guide
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    5 minutes • Beginner
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ display: 'flex' }}>
              <CardMedia
                component="img"
                sx={{ width: 100, height: 100, objectFit: 'cover' }}
                image="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
                alt="Tutorial thumbnail"
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    How to Submit Assignments
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    3 minutes • Beginner
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ display: 'flex' }}>
              <CardMedia
                component="img"
                sx={{ width: 100, height: 100, objectFit: 'cover' }}
                image="https://images.unsplash.com/photo-1451187580459-43490279c0fa"
                alt="Tutorial thumbnail"
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    Understanding Your Dashboard
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    4 minutes • Beginner
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button variant="outlined" onClick={() => navigate('/help/tutorials')}>
            View All Tutorials
          </Button>
        </Box>
      </Paper>

      {/* Contact & Social */}
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Still need help?
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Can't find what you're looking for? Our support team is here to help.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<LiveHelpIcon />}
              onClick={() => navigate('/help/contact')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Contact Support
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <IconButton sx={{ bgcolor: '#25D36620', color: '#25D366' }}>
                <WhatsAppIcon />
              </IconButton>
              <IconButton sx={{ bgcolor: '#1DA1F220', color: '#1DA1F2' }}>
                <TwitterIcon />
              </IconButton>
              <IconButton sx={{ bgcolor: '#4267B220', color: '#4267B2' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton sx={{ bgcolor: '#0077B520', color: '#0077B5' }}>
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Help;