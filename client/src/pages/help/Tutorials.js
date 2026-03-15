import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Avatar,
  Rating,
  LinearProgress,
  Tabs,
  Tab,
  Divider,
  Pagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  PlayCircle as PlayIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  ThumbUp as ThumbUpIcon,
  Visibility as VisibilityIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  AccessTime as TimeIcon,
  SignalCellularAlt as LevelIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Code as CodeIcon,
  DesignServices as DesignIcon,
  Storage as DataIcon,
  Security as SecurityIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material';

const Tutorials = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [page, setPage] = useState(1);
  const tutorialsPerPage = 9;

  const categories = [
    { id: 'all', label: 'All Tutorials', icon: <SchoolIcon /> },
    { id: 'getting-started', label: 'Getting Started', icon: <PlayIcon /> },
    { id: 'courses', label: 'Courses', icon: <SchoolIcon /> },
    { id: 'assignments', label: 'Assignments', icon: <AssignmentIcon /> },
    { id: 'development', label: 'Development', icon: <CodeIcon /> },
    { id: 'design', label: 'Design', icon: <DesignIcon /> },
    { id: 'data', label: 'Data Science', icon: <DataIcon /> },
    { id: 'security', label: 'Security', icon: <SecurityIcon /> },
    { id: 'cloud', label: 'Cloud', icon: <CloudIcon /> },
  ];

  const tutorials = [
    {
      id: 1,
      title: 'Getting Started with Learning Dashboard',
      description: 'Learn how to navigate the platform, set up your profile, and start your learning journey.',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      duration: '5:30',
      level: 'Beginner',
      views: 15234,
      likes: 892,
      category: 'getting-started',
      instructor: {
        name: 'Dr. Jane Smith',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      rating: 4.8,
      publishedDate: '2024-01-15',
    },
    {
      id: 2,
      title: 'How to Enroll in a Course',
      description: 'Step-by-step guide to finding and enrolling in courses that match your interests.',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
      duration: '3:45',
      level: 'Beginner',
      views: 12345,
      likes: 654,
      category: 'courses',
      instructor: {
        name: 'Prof. John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      rating: 4.7,
      publishedDate: '2024-01-10',
    },
    {
      id: 3,
      title: 'Mastering Assignments: Tips and Tricks',
      description: 'Learn how to submit assignments, understand rubrics, and get better grades.',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
      duration: '8:15',
      level: 'Intermediate',
      views: 9876,
      likes: 543,
      category: 'assignments',
      instructor: {
        name: 'Dr. Emily Brown',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
      rating: 4.9,
      publishedDate: '2024-01-05',
    },
    {
      id: 4,
      title: 'Creating Effective Study Plans',
      description: 'Design personalized study plans to achieve your learning goals efficiently.',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
      duration: '6:20',
      level: 'Intermediate',
      views: 8765,
      likes: 432,
      category: 'getting-started',
      instructor: {
        name: 'Prof. Michael Chen',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
      rating: 4.6,
      publishedDate: '2024-01-12',
    },
    {
      id: 5,
      title: 'Understanding Your Grades',
      description: 'How to interpret grades, feedback, and track your progress.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      duration: '4:50',
      level: 'Beginner',
      views: 7654,
      likes: 321,
      category: 'assignments',
      instructor: {
        name: 'Dr. Sarah Wilson',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      },
      rating: 4.5,
      publishedDate: '2024-01-08',
    },
    {
      id: 6,
      title: 'Payment Methods and Invoices',
      description: 'Complete guide to payments, subscriptions, and downloading invoices.',
      thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
      duration: '5:10',
      level: 'Beginner',
      views: 6543,
      likes: 210,
      category: 'getting-started',
      instructor: {
        name: 'Prof. David Brown',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
      rating: 4.4,
      publishedDate: '2024-01-03',
    },
    {
      id: 7,
      title: 'Using the Discussion Forums',
      description: 'Learn how to participate in discussions, ask questions, and help others.',
      thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
      duration: '4:15',
      level: 'Beginner',
      views: 5432,
      likes: 187,
      category: 'courses',
      instructor: {
        name: 'Dr. Lisa Wang',
        avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      },
      rating: 4.7,
      publishedDate: '2024-01-07',
    },
    {
      id: 8,
      title: 'Advanced Features for Educators',
      description: 'Learn how to create courses, assignments, and grade submissions.',
      thumbnail: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
      duration: '12:30',
      level: 'Advanced',
      views: 4321,
      likes: 156,
      category: 'courses',
      instructor: {
        name: 'Prof. James Anderson',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      },
      rating: 4.9,
      publishedDate: '2024-01-14',
    },
    {
      id: 9,
      title: 'Security Best Practices',
      description: 'Keep your account secure with two-factor authentication and other features.',
      thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
      duration: '6:45',
      level: 'Intermediate',
      views: 3210,
      likes: 98,
      category: 'security',
      instructor: {
        name: 'Dr. Robert Martinez',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      },
      rating: 4.8,
      publishedDate: '2024-01-11',
    },
    {
      id: 10,
      title: 'React.js Crash Course',
      description: 'Build modern web applications with React - perfect for beginners.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
      duration: '45:20',
      level: 'Intermediate',
      views: 2890,
      likes: 245,
      category: 'development',
      instructor: {
        name: 'Prof. John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      rating: 4.9,
      publishedDate: '2024-01-09',
    },
    {
      id: 11,
      title: 'Python for Data Science',
      description: 'Learn Python fundamentals for data analysis and visualization.',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-400b3c5b3b9b',
      duration: '52:10',
      level: 'Beginner',
      views: 2567,
      likes: 189,
      category: 'data',
      instructor: {
        name: 'Dr. Emily Brown',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
      rating: 4.8,
      publishedDate: '2024-01-06',
    },
    {
      id: 12,
      title: 'UI/UX Design Principles',
      description: 'Master the fundamentals of user interface and user experience design.',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
      duration: '38:45',
      level: 'Beginner',
      views: 2234,
      likes: 167,
      category: 'design',
      instructor: {
        name: 'Dr. Sarah Wilson',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      },
      rating: 4.7,
      publishedDate: '2024-01-04',
    },
  ];

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  const filteredTutorials = tutorials.filter(tutorial => {
    // Filter by category tab
    if (tabValue !== 0 && tutorial.category !== categories[tabValue]?.id) {
      return false;
    }
    
    // Filter by search
    if (searchQuery && !tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by difficulty
    if (difficultyFilter !== 'all' && tutorial.level !== difficultyFilter) {
      return false;
    }
    
    // Filter by duration (simplified)
    if (durationFilter !== 'all') {
      const minutes = parseInt(tutorial.duration.split(':')[0]);
      if (durationFilter === 'short' && minutes > 10) return false;
      if (durationFilter === 'medium' && (minutes <= 10 || minutes > 30)) return false;
      if (durationFilter === 'long' && minutes <= 30) return false;
    }
    
    return true;
  });

  const paginatedTutorials = filteredTutorials.slice(
    (page - 1) * tutorialsPerPage,
    page * tutorialsPerPage
  );

  const totalPages = Math.ceil(filteredTutorials.length / tutorialsPerPage);

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Video Tutorials
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Learn how to make the most of Learning Dashboard with our comprehensive video guides
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficultyFilter}
                label="Difficulty"
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Duration</InputLabel>
              <Select
                value={durationFilter}
                label="Duration"
                onChange={(e) => setDurationFilter(e.target.value)}
              >
                <MenuItem value="all">Any Duration</MenuItem>
                <MenuItem value="short">Short (&lt;10 min)</MenuItem>
                <MenuItem value="medium">Medium (10-30 min)</MenuItem>
                <MenuItem value="long">Long (&gt;30 min)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={1}>
            <IconButton>
              <FilterIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      {/* Categories Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => {
            setTabValue(v);
            setPage(1);
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((category, index) => (
            <Tab
              key={category.id}
              icon={category.icon}
              label={category.label}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tutorials Grid */}
      {filteredTutorials.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {paginatedTutorials.map((tutorial) => (
              <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 30px -10px rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={tutorial.thumbnail}
                    alt={tutorial.title}
                    sx={{ position: 'relative' }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'rgba(0,0,0,0.5)',
                        borderRadius: '50%',
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PlayIcon sx={{ color: 'white', fontSize: 32 }} />
                    </Box>
                  </CardMedia>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip
                        label={tutorial.level}
                        size="small"
                        color={getDifficultyColor(tutorial.level)}
                      />
                      <Chip
                        icon={<TimeIcon />}
                        label={tutorial.duration}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Typography variant="h6" gutterBottom>
                      {tutorial.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {tutorial.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar src={tutorial.instructor.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                      <Typography variant="caption">
                        {tutorial.instructor.name}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <VisibilityIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                        <Typography variant="caption">
                          {tutorial.views.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ThumbUpIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                        <Typography variant="caption">
                          {tutorial.likes}
                        </Typography>
                      </Box>
                      <Rating value={tutorial.rating} readOnly size="small" />
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PlayIcon />}
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    >
                      Watch Tutorial
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, v) => setPage(v)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PlayIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No tutorials found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}

      {/* Featured Tutorial Section */}
      <Paper sx={{ p: 4, mt: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Featured Tutorial Series
            </Typography>
            <Typography variant="h6" gutterBottom>
              Complete Guide to Learning Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              A comprehensive video series covering everything from basic navigation to advanced features. Perfect for new users and those looking to master the platform.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Chip icon={<PlayIcon />} label="12 videos" />
              <Chip icon={<TimeIcon />} label="2.5 hours" />
              <Chip icon={<PeopleIcon />} label="5.2k views" />
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayIcon />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Start Learning
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              height="250"
              image="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
              alt="Featured tutorial"
              sx={{ borderRadius: 2 }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Tutorials;