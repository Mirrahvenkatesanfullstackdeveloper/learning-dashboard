import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  AvatarGroup,
  LinearProgress,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Alert,
  Skeleton,
  Pagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Archive as ArchiveIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { format, differenceInDays, addDays } from 'date-fns';
import StyledCard from '../../components/Cards/StyledCard';
import { backgrounds } from '../../assets/images/backgrounds';

// Mock study plans data
const mockStudyPlans = [
  {
    id: 1,
    title: 'Full Stack Developer Path',
    description: 'Complete roadmap to become a full-stack developer in 3 months',
    user: {
      id: 101,
      firstName: 'Alice',
      lastName: 'Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    courses: [
      { id: 1, title: 'HTML/CSS Fundamentals', completed: true },
      { id: 2, title: 'JavaScript Essentials', completed: true },
      { id: 3, title: 'React.js Masterclass', completed: false },
      { id: 4, title: 'Node.js Backend Development', completed: false },
      { id: 5, title: 'Database Design', completed: false },
      { id: 6, title: 'DevOps Basics', completed: false },
    ],
    totalCourses: 6,
    completedCourses: 2,
    progress: 33,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    targetDate: addDays(new Date(), 60).toISOString(),
    weeklyHours: 15,
    status: 'active',
    priority: 'high',
    isPublic: true,
    bookmarks: 45,
    tags: ['web-development', 'full-stack', 'career'],
    milestones: [
      { title: 'Frontend Basics', completed: true, date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) },
      { title: 'React Mastery', completed: false, date: addDays(new Date(), 15) },
      { title: 'Backend Development', completed: false, date: addDays(new Date(), 35) },
      { title: 'Full Stack Project', completed: false, date: addDays(new Date(), 55) },
    ],
  },
  {
    id: 2,
    title: 'Data Science Roadmap',
    description: 'Learn data science from scratch with Python and machine learning',
    user: {
      id: 102,
      firstName: 'Bob',
      lastName: 'Smith',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    courses: [
      { id: 7, title: 'Python Fundamentals', completed: true },
      { id: 8, title: 'Data Analysis with Pandas', completed: false },
      { id: 9, title: 'Data Visualization', completed: false },
      { id: 10, title: 'Machine Learning Basics', completed: false },
      { id: 11, title: 'Deep Learning', completed: false },
    ],
    totalCourses: 5,
    completedCourses: 1,
    progress: 20,
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    targetDate: addDays(new Date(), 75).toISOString(),
    weeklyHours: 12,
    status: 'active',
    priority: 'medium',
    isPublic: true,
    bookmarks: 23,
    tags: ['data-science', 'python', 'machine-learning'],
    milestones: [
      { title: 'Python Basics', completed: true, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { title: 'Data Analysis', completed: false, date: addDays(new Date(), 20) },
      { title: 'ML Fundamentals', completed: false, date: addDays(new Date(), 45) },
    ],
  },
  {
    id: 3,
    title: 'UI/UX Design Mastery',
    description: 'Comprehensive UI/UX design course path',
    user: {
      id: 103,
      firstName: 'Carol',
      lastName: 'White',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    courses: [
      { id: 12, title: 'Design Fundamentals', completed: true },
      { id: 13, title: 'Figma Masterclass', completed: true },
      { id: 14, title: 'User Research', completed: false },
      { id: 15, title: 'Wireframing & Prototyping', completed: false },
      { id: 16, title: 'Design Systems', completed: false },
    ],
    totalCourses: 5,
    completedCourses: 2,
    progress: 40,
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    targetDate: addDays(new Date(), 45).toISOString(),
    weeklyHours: 10,
    status: 'active',
    priority: 'high',
    isPublic: false,
    bookmarks: 12,
    tags: ['ui-design', 'ux-design', 'figma'],
    milestones: [
      { title: 'Design Basics', completed: true, date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000) },
      { title: 'Tools Mastery', completed: true, date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
      { title: 'User Research', completed: false, date: addDays(new Date(), 15) },
      { title: 'Portfolio Project', completed: false, date: addDays(new Date(), 40) },
    ],
  },
  {
    id: 4,
    title: 'Cloud Computing with AWS',
    description: 'Become an AWS certified cloud practitioner',
    user: {
      id: 104,
      firstName: 'David',
      lastName: 'Brown',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    courses: [
      { id: 17, title: 'AWS Fundamentals', completed: true },
      { id: 18, title: 'EC2 & Compute Services', completed: false },
      { id: 19, title: 'Storage & Databases', completed: false },
      { id: 20, title: 'Networking & Security', completed: false },
      { id: 21, title: 'Certification Prep', completed: false },
    ],
    totalCourses: 5,
    completedCourses: 1,
    progress: 20,
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    targetDate: addDays(new Date(), 50).toISOString(),
    weeklyHours: 8,
    status: 'active',
    priority: 'medium',
    isPublic: true,
    bookmarks: 34,
    tags: ['aws', 'cloud', 'devops'],
    milestones: [
      { title: 'AWS Basics', completed: true, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { title: 'Core Services', completed: false, date: addDays(new Date(), 15) },
      { title: 'Security & Architecture', completed: false, date: addDays(new Date(), 30) },
      { title: 'Certification Ready', completed: false, date: addDays(new Date(), 45) },
    ],
  },
  {
    id: 5,
    title: 'DevOps Engineering Path',
    description: 'Master DevOps practices and tools',
    user: {
      id: 105,
      firstName: 'Emma',
      lastName: 'Davis',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
    courses: [
      { id: 22, title: 'Linux Fundamentals', completed: false },
      { id: 23, title: 'Git & Version Control', completed: false },
      { id: 24, title: 'Docker & Containers', completed: false },
      { id: 25, title: 'Kubernetes', completed: false },
      { id: 26, title: 'CI/CD Pipelines', completed: false },
    ],
    totalCourses: 5,
    completedCourses: 0,
    progress: 0,
    startDate: addDays(new Date(), 5).toISOString(),
    targetDate: addDays(new Date(), 95).toISOString(),
    weeklyHours: 12,
    status: 'upcoming',
    priority: 'low',
    isPublic: false,
    bookmarks: 8,
    tags: ['devops', 'docker', 'kubernetes'],
    milestones: [
      { title: 'Linux Basics', completed: false, date: addDays(new Date(), 15) },
      { title: 'Containerization', completed: false, date: addDays(new Date(), 35) },
      { title: 'Orchestration', completed: false, date: addDays(new Date(), 60) },
      { title: 'CI/CD Mastery', completed: false, date: addDays(new Date(), 85) },
    ],
  },
  {
    id: 6,
    title: 'Cybersecurity Essentials',
    description: 'Learn network security and ethical hacking',
    user: {
      id: 106,
      firstName: 'Frank',
      lastName: 'Miller',
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    },
    courses: [
      { id: 27, title: 'Network Security', completed: true },
      { id: 28, title: 'Ethical Hacking', completed: true },
      { id: 29, title: 'Cryptography', completed: false },
      { id: 30, title: 'Security Operations', completed: false },
      { id: 31, title: 'Incident Response', completed: false },
    ],
    totalCourses: 5,
    completedCourses: 2,
    progress: 40,
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    targetDate: addDays(new Date(), 30).toISOString(),
    weeklyHours: 15,
    status: 'active',
    priority: 'high',
    isPublic: true,
    bookmarks: 56,
    tags: ['security', 'networking', 'hacking'],
    milestones: [
      { title: 'Network Basics', completed: true, date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000) },
      { title: 'Hacking Techniques', completed: true, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { title: 'Cryptography', completed: false, date: addDays(new Date(), 10) },
      { title: 'Security Operations', completed: false, date: addDays(new Date(), 25) },
    ],
  },
];

const statusColors = {
  active: 'success',
  upcoming: 'info',
  completed: 'primary',
  archived: 'default',
};

const StudyPlans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studyPlans, setStudyPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [page, setPage] = useState(1);
  const plansPerPage = 6;

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setStudyPlans(mockStudyPlans);
      setFilteredPlans(mockStudyPlans);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterPlans();
  }, [searchTerm, statusFilter, sortBy, studyPlans]);

  const filterPlans = () => {
    let filtered = [...studyPlans];

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        break;
      case 'progress':
        filtered.sort((a, b) => b.progress - a.progress);
        break;
      case 'target':
        filtered.sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
        break;
      case 'popular':
        filtered.sort((a, b) => b.bookmarks - a.bookmarks);
        break;
      default:
        break;
    }

    setFilteredPlans(filtered);
    setPage(1);
  };

  const handleMenuOpen = (event, plan) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlan(plan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPlan(null);
  };

  const getDaysRemaining = (targetDate) => {
    const days = differenceInDays(new Date(targetDate), new Date());
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    return `${days} days left`;
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'success';
    if (progress >= 50) return 'primary';
    if (progress >= 25) return 'warning';
    return 'error';
  };

  const paginatedPlans = filteredPlans.slice(
    (page - 1) * plansPerPage,
    page * plansPerPage
  );

  const totalPages = Math.ceil(filteredPlans.length / plansPerPage);

  const StatCard = ({ title, value, icon, color }) => (
    <StyledCard
      gradient={`linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`}
      pattern={backgrounds.pattern2}
      sx={{ height: '100%' }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
              {value}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {title}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </StyledCard>
  );

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Study Plans
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/study-plans/create')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Create Plan
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Create and manage your personalized learning paths
        </Typography>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Plans"
            value={studyPlans.filter(p => p.status === 'active').length}
            icon={<TimelineIcon />}
            color="#667EEA"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={studyPlans.filter(p => p.progress === 100).length}
            icon={<TrophyIcon />}
            color="#48BB78"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Courses"
            value={studyPlans.reduce((acc, p) => acc + p.totalCourses, 0)}
            icon={<SchoolIcon />}
            color="#F8B042"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg. Progress"
            value={`${Math.round(studyPlans.reduce((acc, p) => acc + p.progress, 0) / studyPlans.length)}%`}
            icon={<CheckCircleIcon />}
            color="#F56565"
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search study plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="recent">Most Recent</MenuItem>
                <MenuItem value="progress">Progress</MenuItem>
                <MenuItem value="target">Target Date</MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2, alignSelf: 'center' }}>
              {filteredPlans.length} plans found
            </Typography>
            <Button
              variant={viewMode === 'grid' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Study Plans Grid/List */}
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} md={viewMode === 'grid' ? 6 : 12} lg={viewMode === 'grid' ? 4 : 12} key={item}>
              <Skeleton variant="rectangular" height={viewMode === 'grid' ? 300 : 200} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : filteredPlans.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {paginatedPlans.map((plan) => (
              <Grid item xs={12} md={viewMode === 'grid' ? 6 : 12} lg={viewMode === 'grid' ? 4 : 12} key={plan.id}>
                {viewMode === 'grid' ? (
                  // Grid View Card
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 30px -10px rgba(0,0,0,0.3)',
                      },
                    }}
                    onClick={() => navigate(`/study-plans/${plan.id}`)}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar src={plan.user.avatar} sx={{ width: 40, height: 40 }} />
                          <Box>
                            <Typography variant="subtitle2">
                              {plan.user.firstName} {plan.user.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Created {format(new Date(plan.startDate), 'MMM dd, yyyy')}
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Chip
                            label={plan.status}
                            size="small"
                            color={statusColors[plan.status]}
                            sx={{ mr: 1 }}
                          />
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuOpen(e, plan);
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Title and Description */}
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {plan.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                        }}
                      >
                        {plan.description}
                      </Typography>

                      {/* Tags */}
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
                        {plan.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>

                      {/* Progress */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">Progress</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {plan.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={plan.progress}
                          color={getProgressColor(plan.progress)}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                          }}
                        />
                      </Box>

                      {/* Stats */}
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant="h6" color="primary">
                            {plan.completedCourses}
                          </Typography>
                          <Typography variant="caption">Completed</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="h6" color="text.secondary">
                            {plan.totalCourses}
                          </Typography>
                          <Typography variant="caption">Total</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="h6" color="text.secondary">
                            {plan.weeklyHours}h
                          </Typography>
                          <Typography variant="caption">Weekly</Typography>
                        </Grid>
                      </Grid>

                      {/* Milestone Preview */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                          Next Milestone:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TimelineIcon fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {plan.milestones.find(m => !m.completed)?.title || 'All completed!'}
                          </Typography>
                          <Chip
                            size="small"
                            label={getDaysRemaining(plan.targetDate)}
                            color={getDaysRemaining(plan.targetDate) === 'Overdue' ? 'error' : 'default'}
                          />
                        </Box>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/study-plans/${plan.id}`);
                        }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                ) : (
                  // List View Card
                  <Paper
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateX(8px)',
                        boxShadow: '0 8px 20px -8px rgba(0,0,0,0.3)',
                      },
                    }}
                    onClick={() => navigate(`/study-plans/${plan.id}`)}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={plan.user.avatar} />
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {plan.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              by {plan.user.firstName} {plan.user.lastName}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ flex: 1, mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={plan.progress}
                              color={getProgressColor(plan.progress)}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                          <Typography variant="body2">{plan.progress}%</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SchoolIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                          <Typography variant="body2">
                            {plan.completedCourses}/{plan.totalCourses}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Chip
                          label={plan.status}
                          size="small"
                          color={statusColors[plan.status]}
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Tooltip title="Bookmark">
                            <IconButton size="small" sx={{ mr: 1 }}>
                              <BookmarkBorderIcon />
                            </IconButton>
                          </Tooltip>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuOpen(e, plan);
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                )}
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
          <TimelineIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No study plans found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first study plan to start your learning journey'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/study-plans/create')}
          >
            Create Study Plan
          </Button>
        </Box>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          navigate(`/study-plans/${selectedPlan?.id}`);
          handleMenuClose();
        }}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={() => {
          navigate(`/study-plans/${selectedPlan?.id}/edit`);
          handleMenuClose();
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit Plan
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ShareIcon fontSize="small" sx={{ mr: 1 }} /> Share
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ArchiveIcon fontSize="small" sx={{ mr: 1 }} /> Archive
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default StudyPlans;