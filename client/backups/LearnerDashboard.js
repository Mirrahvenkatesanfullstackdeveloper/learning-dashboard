import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Rating,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Pending as PendingIcon,
  PlayCircle as PlayIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,        // Added missing BarChart
  Bar,             // Added missing Bar
  XAxis,           // Added missing XAxis
  YAxis,           // Added missing YAxis
  CartesianGrid,   // Added missing CartesianGrid
} from 'recharts';
import StyledCard from '../../components/Cards/StyledCard';
import { backgrounds } from '../../assets/images/backgrounds';

// Mock data for learner dashboard
const enrolledCourses = [
  {
    id: 1,
    title: 'Full Stack Web Development',
    instructor: 'Dr. Jane Smith',
    progress: 65,
    nextLesson: 'React Hooks Deep Dive',
    dueAssignments: 2,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    rating: 4.5,
  },
  {
    id: 2,
    title: 'Advanced React Patterns',
    instructor: 'Prof. John Doe',
    progress: 42,
    nextLesson: 'Compound Components',
    dueAssignments: 1,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    rating: 5,
  },
  {
    id: 3,
    title: 'Database Design Fundamentals',
    instructor: 'Dr. Emily Brown',
    progress: 78,
    nextLesson: 'Normalization Forms',
    dueAssignments: 0,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d',
    rating: 4,
  },
];

const upcomingTasks = [
  {
    id: 1,
    title: 'React Hooks Assignment',
    course: 'Full Stack Web Development',
    due: 'Tomorrow',
    priority: 'high',
    type: 'assignment',
  },
  {
    id: 2,
    title: 'Database Normalization Quiz',
    course: 'Database Design Fundamentals',
    due: 'In 3 days',
    priority: 'medium',
    type: 'quiz',
  },
  {
    id: 3,
    title: 'Project Proposal',
    course: 'Advanced React Patterns',
    due: 'Next week',
    priority: 'low',
    type: 'project',
  },
];

const recentAchievements = [
  {
    id: 1,
    title: 'Quick Learner',
    description: 'Completed 5 lessons in one day',
    date: '2 days ago',
    icon: '🚀',
    color: '#667EEA',
  },
  {
    id: 2,
    title: 'Perfect Score',
    description: 'Got 100% on JavaScript Quiz',
    date: '1 week ago',
    icon: '🎯',
    color: '#48BB78',
  },
  {
    id: 3,
    title: 'Consistency King',
    description: '7-day learning streak',
    date: '2 weeks ago',
    icon: '🔥',
    color: '#F8B042',
  },
];

const skillProgress = [
  { subject: 'React', A: 85, fullMark: 100 },
  { subject: 'Node.js', A: 70, fullMark: 100 },
  { subject: 'MongoDB', A: 60, fullMark: 100 },
  { subject: 'JavaScript', A: 90, fullMark: 100 },
  { subject: 'HTML/CSS', A: 95, fullMark: 100 },
  { subject: 'TypeScript', A: 45, fullMark: 100 },
];

const studyTimeData = [
  { name: 'Mon', hours: 2.5 },
  { name: 'Tue', hours: 3 },
  { name: 'Wed', hours: 4 },
  { name: 'Thu', hours: 2 },
  { name: 'Fri', hours: 3.5 },
  { name: 'Sat', hours: 5 },
  { name: 'Sun', hours: 1.5 },
];

const LearnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [bookmarkedCourses, setBookmarkedCourses] = useState([]);

  const COLORS = ['#667EEA', '#F8B042', '#48BB78', '#F56565', '#9F7AEA'];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'assignment': return <AssignmentIcon />;
      case 'quiz': return <SchoolIcon />;
      case 'project': return <TrophyIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const StatCard = ({ title, value, icon, subtitle, color }) => (
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
            {subtitle && (
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mt: 1 }}>
                {subtitle}
              </Typography>
            )}
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
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome back, {user?.firstName}! 🎓
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Continue your learning journey. You're making great progress!
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Courses Enrolled"
            value={3}
            icon={<SchoolIcon />}
            subtitle="2 in progress, 1 completed"
            color="#667EEA"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overall Progress"
            value="62%"
            icon={<TimelineIcon />}
            subtitle="+15% this week"
            color="#48BB78"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Study Streak"
            value="7 days"
            icon={<TrendingUpIcon />}
            subtitle="Personal best: 14 days"
            color="#F8B042"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Achievements"
            value={12}
            icon={<TrophyIcon />}
            subtitle="3 new this month"
            color="#F56565"
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column - Courses */}
        <Grid item xs={12} md={8}>
          {/* Continue Learning */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Continue Learning
            </Typography>
            <Grid container spacing={3}>
              {enrolledCourses.map((course) => (
                <Grid item xs={12} key={course.id}>
                  <Card
                    sx={{
                      display: 'flex',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateX(8px)',
                        boxShadow: '0 8px 20px -8px rgba(0,0,0,0.3)',
                      },
                    }}
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <Box
                      sx={{
                        width: 120,
                        background: `linear-gradient(135deg, #667EEA 0%, #764BA2 100%), url(${course.thumbnail})`,
                        backgroundSize: 'cover',
                        backgroundBlendMode: 'overlay',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PlayIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                    </Box>
                    <Box sx={{ flex: 1, p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6">{course.title}</Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBookmarkedCourses(prev =>
                              prev.includes(course.id)
                                ? prev.filter(id => id !== course.id)
                                : [...prev, course.id]
                            );
                          }}
                        >
                          {bookmarkedCourses.includes(course.id) ? (
                            <BookmarkIcon color="primary" />
                          ) : (
                            <BookmarkBorderIcon />
                          )}
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Instructor: {course.instructor}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={course.rating} readOnly size="small" />
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          {course.rating}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">Course Progress</Typography>
                          <Typography variant="body2">{course.progress}%</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={course.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: '#E2E8F0',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ScheduleIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                          <Typography variant="caption" color="text.secondary">
                            Next: {course.nextLesson}
                          </Typography>
                        </Box>
                        {course.dueAssignments > 0 && (
                          <Chip
                            size="small"
                            label={`${course.dueAssignments} assignment${course.dueAssignments > 1 ? 's' : ''} due`}
                            color="warning"
                          />
                        )}
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Study Time Chart */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Weekly Study Time
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={studyTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#718096" />
                <YAxis stroke="#718096" />
                <Tooltip />
                <Bar dataKey="hours" fill="#667EEA" radius={[4, 4, 0, 0]}>
                  {studyTimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          {/* Recent Achievements */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Recent Achievements
            </Typography>
            <List>
              {recentAchievements.map((achievement, index) => (
                <React.Fragment key={achievement.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: achievement.color + '20', color: achievement.color }}>
                        <Typography variant="h6">{achievement.icon}</Typography>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={achievement.title}
                      secondary={achievement.description}
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="caption" color="text.secondary">
                        {achievement.date}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < recentAchievements.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Right Column - Tasks & Skills */}
        <Grid item xs={12} md={4}>
          {/* Upcoming Tasks */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Upcoming Tasks
            </Typography>
            <List>
              {upcomingTasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getPriorityColor(task.priority)}.light` }}>
                        {getTaskIcon(task.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {task.course}
                          </Typography>
                          <Chip
                            label={task.due}
                            size="small"
                            color={getPriorityColor(task.priority)}
                            sx={{ mt: 0.5, height: 20 }}
                          />
                        </>
                      }
                    />
                  </ListItem>
                  {index < upcomingTasks.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate('/assignments')}
            >
              View All Tasks
            </Button>
          </Paper>

          {/* Skills Progress */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Skills Progress
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillProgress}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#718096', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#718096' }} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#667EEA"
                  fill="#667EEA"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>

          {/* Recommended Courses */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Recommended for You
            </Typography>
            <List>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src="https://images.unsplash.com/photo-1555066931-4365d14bab8c" variant="rounded" />
                </ListItemAvatar>
                <ListItemText
                  primary="TypeScript Masterclass"
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Based on your interest in JavaScript
                      </Typography>
                      <Rating value={4.5} size="small" readOnly />
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src="https://images.unsplash.com/photo-1526379095098-400b3c5b3b9b" variant="rounded" />
                </ListItemAvatar>
                <ListItemText
                  primary="Python for Data Science"
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Trending in your field
                      </Typography>
                      <Rating value={4} size="small" readOnly />
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src="https://images.unsplash.com/photo-1522252234503-e356532cafd5" variant="rounded" />
                </ListItemAvatar>
                <ListItemText
                  primary="AWS Certification Prep"
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        High demand skill
                      </Typography>
                      <Rating value={5} size="small" readOnly />
                    </>
                  }
                />
              </ListItem>
            </List>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate('/courses')}
            >
              Explore More Courses
            </Button>
          </Paper>

          {/* Learning Streak Alert */}
          <Alert
            icon={<TrophyIcon />}
            severity="success"
            sx={{ mt: 3 }}
            action={
              <Button color="inherit" size="small">
                Share
              </Button>
            }
          >
            You're on a 7-day learning streak! Keep it up! 🔥
          </Alert>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/study-plans/create')}
          startIcon={<TimelineIcon />}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          Create Study Plan
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/payments')}
          startIcon={<SchoolIcon />}
        >
          Browse Courses
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/help')}
          startIcon={<StarIcon />}
        >
          Get Help
        </Button>
      </Box>
    </Container>
  );
};

export default LearnerDashboard;