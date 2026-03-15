import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Checkbox,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Breadcrumbs,
  Link,
  Alert,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Rating,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Archive as ArchiveIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  CheckCircleOutline as CheckedIcon,
  Assignment as AssignmentIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

// IMPORTANT: Timeline components must be imported from @mui/lab
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from '@mui/lab';

import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { format, differenceInDays, addDays } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

const StudyPlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  // Mock study plan data
  const mockPlan = {
    id: 1,
    title: 'Full Stack Developer Path',
    description: 'Complete roadmap to become a full-stack developer in 3 months',
    longDescription: `
      This comprehensive study plan is designed to take you from beginner to job-ready full-stack developer in just 3 months. You'll learn front-end and back-end development, databases, and deployment through a structured curriculum.

      What you'll achieve:
      • Master HTML, CSS, and JavaScript
      • Build responsive web applications with React
      • Create RESTful APIs with Node.js and Express
      • Work with MongoDB and SQL databases
      • Deploy applications to the cloud
      • Build a portfolio of real-world projects
    `,
    user: {
      id: 101,
      firstName: 'Alice',
      lastName: 'Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      bio: 'Senior Full Stack Developer | Technical Mentor',
      rating: 4.9,
      plansCreated: 12,
      followers: 234,
    },
    courses: [
      { 
        id: 1, 
        title: 'HTML/CSS Fundamentals', 
        description: 'Learn the building blocks of web pages',
        completed: true,
        completedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 20,
        resources: 15,
        assignments: 3,
        thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713',
      },
      { 
        id: 2, 
        title: 'JavaScript Essentials', 
        description: 'Master the programming language of the web',
        completed: true,
        completedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 30,
        resources: 22,
        assignments: 5,
        thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a',
      },
      { 
        id: 3, 
        title: 'React.js Masterclass', 
        description: 'Build modern user interfaces with React',
        completed: false,
        progress: 60,
        duration: 40,
        resources: 28,
        assignments: 4,
        nextLesson: 'Hooks Deep Dive',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
      },
      { 
        id: 4, 
        title: 'Node.js Backend Development', 
        description: 'Create scalable backend services',
        completed: false,
        progress: 0,
        duration: 35,
        resources: 20,
        assignments: 4,
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479',
      },
      { 
        id: 5, 
        title: 'Database Design', 
        description: 'Work with SQL and NoSQL databases',
        completed: false,
        progress: 0,
        duration: 25,
        resources: 18,
        assignments: 3,
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d',
      },
      { 
        id: 6, 
        title: 'DevOps Basics', 
        description: 'Learn deployment and CI/CD',
        completed: false,
        progress: 0,
        duration: 20,
        resources: 15,
        assignments: 2,
        thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9',
      },
    ],
    totalCourses: 6,
    completedCourses: 2,
    progress: 33,
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    targetDate: addDays(new Date(), 30).toISOString(),
    weeklyHours: 15,
    totalHours: 170,
    completedHours: 50,
    status: 'active',
    priority: 'high',
    isPublic: true,
    bookmarks: 45,
    tags: ['web-development', 'full-stack', 'career'],
    milestones: [
      { 
        title: 'Frontend Basics', 
        completed: true, 
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Complete HTML, CSS, and JavaScript courses',
      },
      { 
        title: 'React Mastery', 
        completed: false, 
        date: addDays(new Date(), 10).toISOString(),
        description: 'Finish React.js Masterclass and build projects',
        progress: 60,
      },
      { 
        title: 'Backend Development', 
        completed: false, 
        date: addDays(new Date(), 25).toISOString(),
        description: 'Complete Node.js and Database courses',
      },
      { 
        title: 'Full Stack Project', 
        completed: false, 
        date: addDays(new Date(), 40).toISOString(),
        description: 'Build and deploy a full-stack application',
      },
    ],
    progressData: [
      { week: 1, progress: 10 },
      { week: 2, progress: 18 },
      { week: 3, progress: 22 },
      { week: 4, progress: 28 },
      { week: 5, progress: 33 },
      { week: 6, progress: 33 },
    ],
    recommendedResources: [
      { title: 'React Documentation', type: 'link', url: 'https://reactjs.org' },
      { title: 'Node.js Best Practices', type: 'article', url: '#' },
      { title: 'Database Design Patterns', type: 'video', url: '#' },
    ],
    comments: [
      {
        id: 1,
        user: 'Bob Smith',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
        comment: 'Great plan! Following this path has been really helpful.',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        user: 'Carol White',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        comment: 'How much time should I dedicate per week?',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setPlan(mockPlan);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleCourseToggle = (courseId) => {
    // Toggle course completion
    console.log('Toggle course:', courseId);
  };

  const getDaysRemaining = () => {
    const days = differenceInDays(new Date(plan?.targetDate), new Date());
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    return `${days} days left`;
  };

  const getRecommendedPace = () => {
    const remainingCourses = plan?.totalCourses - plan?.completedCourses;
    const remainingDays = differenceInDays(new Date(plan?.targetDate), new Date());
    if (remainingDays <= 0) return '0';
    const coursesPerWeek = (remainingCourses / (remainingDays / 7)).toFixed(1);
    return coursesPerWeek;
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/study-plans" color="inherit">
          Study Plans
        </Link>
        <Typography color="text.primary">{plan?.title}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              {plan?.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <Chip
                icon={<ScheduleIcon />}
                label={`Target: ${format(new Date(plan?.targetDate), 'MMMM dd, yyyy')}`}
                color={getDaysRemaining() === 'Overdue' ? 'error' : 'primary'}
                variant="outlined"
              />
              <Chip
                icon={<TimeIcon />}
                label={`${plan?.weeklyHours} hours/week`}
                variant="outlined"
              />
              <Chip
                label={plan?.status}
                color={plan?.status === 'active' ? 'success' : 'default'}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={4.5} readOnly size="small" />
                <Typography variant="caption" sx={{ ml: 1 }}>
                  (12 reviews)
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" color="text.secondary" paragraph>
              {plan?.longDescription}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={bookmarked ? 'Remove bookmark' : 'Bookmark'}>
              <IconButton onClick={handleBookmark}>
                {bookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Progress Overview */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Progress Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Overall Progress</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {plan?.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={plan?.progress}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: '#E2E8F0',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 5,
                      },
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box>
                    <Typography variant="h4" color="primary">
                      {plan?.completedCourses}
                    </Typography>
                    <Typography variant="caption">Completed</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" color="text.secondary">
                      {plan?.totalCourses}
                    </Typography>
                    <Typography variant="caption">Total Courses</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" color="text.secondary">
                      {plan?.completedHours}/{plan?.totalHours}h
                    </Typography>
                    <Typography variant="caption">Hours</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ height: 100 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={plan?.progressData}>
                      <Line
                        type="monotone"
                        dataKey="progress"
                        stroke="#667EEA"
                        strokeWidth={2}
                        dot={{ fill: '#667EEA' }}
                      />
                      <CartesianGrid stroke="#E2E8F0" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <RechartsTooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Timeline/Milestones */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Learning Timeline
            </Typography>
            <Timeline position="alternate">
              {plan?.milestones.map((milestone, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot color={milestone.completed ? 'success' : 'grey'}>
                      {milestone.completed ? <CheckCircleIcon /> : <ScheduleIcon />}
                    </TimelineDot>
                    {index < plan.milestones.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={3} sx={{ p: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {milestone.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Target: {format(new Date(milestone.date), 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {milestone.description}
                      </Typography>
                      {milestone.progress !== undefined && (
                        <Box sx={{ mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={milestone.progress}
                            sx={{ height: 4, borderRadius: 2 }}
                          />
                        </Box>
                      )}
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>

          {/* Courses List */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Courses in this Plan
            </Typography>
            <List>
              {plan?.courses.map((course, index) => (
                <React.Fragment key={course.id}>
                  <ListItem
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: '#F7F9FC',
                      },
                    }}
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <ListItemAvatar>
                      <Avatar src={course.thumbnail} variant="rounded" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">
                            {course.title}
                          </Typography>
                          {course.completed && (
                            <Chip
                              size="small"
                              label="Completed"
                              color="success"
                              icon={<CheckCircleIcon />}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {course.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Typography variant="caption">
                              ⏱️ {course.duration} hours
                            </Typography>
                            <Typography variant="caption">
                              📚 {course.resources} resources
                            </Typography>
                            <Typography variant="caption">
                              📝 {course.assignments} assignments
                            </Typography>
                          </Box>
                          {!course.completed && course.progress > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={course.progress}
                                sx={{ height: 4, borderRadius: 2 }}
                              />
                            </Box>
                          )}
                        </>
                      }
                    />
                    <Checkbox
                      edge="end"
                      icon={<UncheckedIcon />}
                      checkedIcon={<CheckedIcon color="success" />}
                      checked={course.completed}
                      onChange={() => handleCourseToggle(course.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </ListItem>
                  {index < plan.courses.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Creator Info */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Created by
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar src={plan?.user.avatar} sx={{ width: 50, height: 50, mr: 2 }} />
              <Box>
                <Typography variant="subtitle2">
                  {plan?.user.firstName} {plan?.user.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {plan?.user.bio}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {plan?.user.rating}
                </Typography>
                <Typography variant="caption">Rating</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {plan?.user.plansCreated}
                </Typography>
                <Typography variant="caption">Plans</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {plan?.user.followers}
                </Typography>
                <Typography variant="caption">Followers</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Stats Card */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Plan Statistics
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <ScheduleIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Time Remaining"
                  secondary={getDaysRemaining()}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Recommended Pace"
                  secondary={`${getRecommendedPace()} courses/week`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Total Hours"
                  secondary={`${plan?.completedHours}/${plan?.totalHours} hours completed`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TrophyIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Completion Rate"
                  secondary={`${Math.round((plan?.completedCourses / plan?.totalCourses) * 100)}%`}
                />
              </ListItem>
            </List>
          </Paper>

          {/* Recommended Resources */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recommended Resources
            </Typography>
            <List>
              {plan?.recommendedResources.map((resource, index) => (
                <ListItem
                  key={index}
                  button
                  component="a"
                  href={resource.url}
                  target="_blank"
                >
                  <ListItemIcon>
                    {resource.type === 'link' && <SchoolIcon />}
                    {resource.type === 'article' && <AssignmentIcon />}
                    {resource.type === 'video' && <ScheduleIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={resource.title}
                    secondary={resource.type}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Discussion */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Discussion
            </Typography>
            {plan?.comments.map((comment) => (
              <Box key={comment.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar src={comment.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                  <Typography variant="subtitle2">
                    {comment.user}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {format(new Date(comment.date), 'MMM dd')}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ml: 4 }}>
                  {comment.comment}
                </Typography>
                {comment.id < plan.comments.length && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => {/* Open comment dialog */}}
            >
              Add Comment
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => navigate(`/study-plans/${id}/edit`)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit Plan
        </MenuItem>
        <MenuItem onClick={() => {/* Handle duplicate */}}>
          <AddIcon fontSize="small" sx={{ mr: 1 }} /> Duplicate
        </MenuItem>
        <MenuItem onClick={() => {/* Handle archive */}}>
          <ArchiveIcon fontSize="small" sx={{ mr: 1 }} /> Archive
        </MenuItem>
        <MenuItem onClick={() => {/* Handle delete */}} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete Plan
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default StudyPlanDetails;